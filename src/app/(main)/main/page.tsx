"use client";

import { useState, useRef, useEffect } from "react";
import Home3 from "../_components/home-3";
import Home4 from "../_components/home-4";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPages, setMaxPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (id === "1") {
      setMaxPages(2);
    }
  }, [id]);

  const { data: main } = api.main.getById.useQuery({ id: id ?? "" });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (maxPages <= 1) return;

    startX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (maxPages <= 1) return;

    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < maxPages) {
        setCurrentPage(currentPage + 1);
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (maxPages <= 1) return;

    if (currentPage < maxPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (containerRef.current && maxPages > 1) {
      containerRef.current.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage, maxPages]);

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
        {/* Page 1 */}
        {/* <Home1 onNext={handleNextPage} /> */}

        {/* Page 2 */}
        {/* <Home2 onNext={handleNextPage} /> */}

        {/* Page 3 */}
        {maxPages > 1 && <Home3 onNext={handleNextPage} main={main} />}

        {/* Page 4 */}
        <Home4 main={main} />
      </div>

      {/* Page indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {Array.from({ length: maxPages }, (_, index) => (
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
