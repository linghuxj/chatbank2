"use client";

import { useEffect, useState } from "react";
import { SubHeader } from "@/components/header/sub-header";
export default function PDFViewer() {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrl(params.get("url") ?? "");
  }, []);

  if (!url) return null;

  return (
    <div className="h-screen w-full">
      <SubHeader title="PDF 文档" />
      <iframe
        src={url}
        className="h-full w-full border-none"
        title="PDF Viewer"
      />
    </div>
  );
}
