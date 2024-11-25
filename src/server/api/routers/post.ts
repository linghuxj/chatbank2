import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { comments, posts, replies } from "@/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  // 获取帖子列表
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, userId } = input;

      try {
        const items = await ctx.db.query.posts.findMany({
          limit: limit + 1,
          where: (posts, { eq, and, gt }) => {
            const conditions = [eq(posts.isDeleted, false)];

            if (cursor) {
              conditions.push(gt(posts.id, cursor));
            }

            if (userId) {
              conditions.push(eq(posts.userId, userId));
            }

            return and(...conditions);
          },
          with: {
            user: true,
          },
          orderBy: [desc(posts.createdAt)],
        });

        let nextCursor: string | null = null;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get post list",
        });
      }
    }),

  // 获取帖子详情
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq, and }) =>
          and(eq(posts.id, input.id), eq(posts.isDeleted, false)),
        with: {
          user: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // 创建帖子
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        summary: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .insert(posts)
        .values({
          userId: ctx.session.user.id,
          title: input.title,
          content: input.content,
          summary: input.summary,
        })
        .returning();

      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }

      return post;
    }),

  // 删除帖子（软删除）
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, input.id),
      });

      if (!post || post.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      return ctx.db
        .update(posts)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id));
    }),
});

export const commentRouter = createTRPCRouter({
  // 获取帖子的评论列表
  getList: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, postId } = input;

      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, input.postId),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // 如果用户未登录，则不能查看评论
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view comments",
        });
      }
      const currentUser = ctx.session.user;

      // 先获取所有管理员的ID
      const adminUsers = await ctx.db.query.users.findMany({
        where: (users, { eq }) => eq(users.role, "admin"),
        columns: {
          id: true,
        },
      });

      const adminUserIds = adminUsers.map((user) => user.id);

      const commentList = await ctx.db.query.comments.findMany({
        limit: limit + 1,
        where: (comments, { eq, and, gt, or, inArray }) => {
          const conditions = [
            eq(comments.postId, postId),
            eq(comments.isDeleted, false),
          ];

          // 普通用户只能看到自己的评论和管理员的评论
          if (currentUser.role === "user") {
            conditions.push(
              or(
                eq(comments.userId, currentUser.id),
                inArray(comments.userId, adminUserIds),
              )!,
            );
          }

          if (cursor) {
            conditions.push(gt(comments.id, cursor));
          }

          return and(...conditions);
        },
        with: {
          user: true,
        },
        orderBy: [desc(comments.createdAt)],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (commentList.length > limit) {
        const nextItem = commentList.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: commentList,
        nextCursor,
      };
    }),

  // 创建评论
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
        attitude: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [comment] = await ctx.db
        .insert(comments)
        .values({
          postId: input.postId,
          userId: ctx.session.user.id,
          content: input.content,
          attitude: input.attitude,
        })
        .returning();

      // 更新帖子评论数
      await ctx.db
        .update(posts)
        .set({
          commentCount: sql`${posts.commentCount} + 1`,
        })
        .where(eq(posts.id, input.postId));

      return comment;
    }),

  // 删除评论
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.query.comments.findFirst({
        where: (comments, { eq }) => eq(comments.id, input.id),
      });

      if (!comment || comment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      return ctx.db
        .update(comments)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
        })
        .where(eq(comments.id, input.id));
    }),
});

export const replyRouter = createTRPCRouter({
  // 创建回复
  create: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string().min(1),
        replyToId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [reply] = await ctx.db
        .insert(replies)
        .values({
          commentId: input.commentId,
          userId: ctx.session.user.id,
          content: input.content,
          replyToId: input.replyToId,
        })
        .returning();

      // 更新评论回复数
      await ctx.db
        .update(comments)
        .set({
          replyCount: sql`${comments.replyCount} + 1`,
        })
        .where(eq(comments.id, input.commentId));

      return reply;
    }),

  // 删除回复
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reply = await ctx.db.query.replies.findFirst({
        where: (replies, { eq }) => eq(replies.id, input.id),
      });

      if (!reply || reply.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      await ctx.db.transaction(async (tx) => {
        // 软删除回复
        await tx
          .update(replies)
          .set({
            isDeleted: true,
            updatedAt: new Date(),
          })
          .where(eq(replies.id, input.id));

        // 减少评论的回复计数
        await tx
          .update(comments)
          .set({
            replyCount: sql`${comments.replyCount} - 1`,
          })
          .where(eq(comments.id, reply.commentId));
      });

      return reply;
    }),

  // 获取评论的回复列表
  getList: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, commentId } = input;

      const replyList = await ctx.db.query.replies.findMany({
        limit: limit + 1,
        where: (replies, { eq, and, gt }) => {
          const conditions = [
            eq(replies.commentId, commentId),
            eq(replies.isDeleted, false),
          ];

          if (cursor) {
            conditions.push(gt(replies.id, cursor));
          }

          return and(...conditions);
        },
        with: {
          user: true,
        },
        orderBy: [desc(replies.createdAt)],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (replyList.length > limit) {
        const nextItem = replyList.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: replyList,
        nextCursor,
      };
    }),
});
