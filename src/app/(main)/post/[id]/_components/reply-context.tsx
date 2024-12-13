"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ReplyContext {
  replyTo: { commentId: string; userName: string } | null;
  setReplyTo: (value: { commentId: string; userName: string } | null) => void;
}

const ReplyContext = createContext<ReplyContext | undefined>(undefined);

export function ReplyContextProvider({ children }: { children: ReactNode }) {
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    userName: string;
  } | null>(null);

  return (
    <ReplyContext.Provider value={{ replyTo, setReplyTo }}>
      {children}
    </ReplyContext.Provider>
  );
}

export function useReplyContext() {
  const context = useContext(ReplyContext);
  if (context === undefined) {
    throw new Error(
      "useReplyContext must be used within a ReplyContextProvider",
    );
  }
  return context;
}
