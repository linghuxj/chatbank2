"use client";

import { useState, useRef, useEffect } from "react";
import Business1InputForm from "./_components/one";
import Business2InputForm from "./_components/two";
import Business3InputForm from "./_components/three";
import { toast } from "@/lib/hooks/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function PublishPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    business1: "",
    business2: "",
    business3: "",
  });

  const { mutateAsync: createMain } = api.main.create.useMutation();

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < 3) {
        setCurrentPage(currentPage + 1);
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage]);

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: "标题不能为空",
        description: "请为当前业务起个吸引力的标题",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createMain({
        title: formData.title,
        business: formData.business1,
        issue: formData.business2,
        reason: formData.business3,
      });

      toast({
        title: "发表成功",
        description: "正在跳转...",
      });

      router.push(`/main?id=${result.id}`);
    } catch (error) {
      toast({
        title: "发表失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={containerRef}
        className="flex h-full transition-transform duration-300 ease-in-out"
      >
        <Business1InputForm
          value={formData.business1}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, business1: value }))
          }
          onNext={handleNextPage}
        />

        <Business2InputForm
          value={formData.business2}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, business2: value }))
          }
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />

        <Business3InputForm
          value={formData.business3}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, business3: value }))
          }
          title={formData.title}
          onTitleChange={(value) =>
            setFormData((prev) => ({ ...prev, title: value }))
          }
          onPrev={handlePrevPage}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {/* Page indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentPage === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  );
}
