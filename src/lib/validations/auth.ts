import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .length(11, "手机号必须是11位")
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号"),
  password: z.string().min(6, "密码至少需要6个字符"),
  remember: z.boolean().default(false),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "用户名至少需要2个字符"),
    phone: z
      .string()
      .length(11, "手机号必须是11位")
      .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号"),
    password: z
      .string()
      .min(6, "密码至少需要6个字符")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "密码需要包含大小写字母和数字",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
