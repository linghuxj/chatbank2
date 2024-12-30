"use client";

import { useState, useRef, useEffect } from "react";
import Home3 from "../_components/home-3";
import Home4 from "../_components/home-4";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const params = useSearchParams();
  const id = params.get("id");

  const { data: main } = api.main.getById.useQuery({ id: id ?? "" });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (main?.maxPage < 3) return;

    startX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (main?.maxPage < 3) return;

    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < 2) {
        setCurrentPage(currentPage + 1);
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (main?.maxPage <= 2) return;

    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (containerRef.current && main?.maxPage === 3) {
      containerRef.current.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage, main]);

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
        {(main?.maxPage === 1 || main?.maxPage === 3) && (
          <Home3 onNext={handleNextPage} main={main} />
        )}

        {/* Page 4 */}
        {(main?.maxPage === 2 || main?.maxPage === 3) && <Home4 main={main} />}
      </div>

      {/* Page indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {Array.from({ length: main?.maxPage === 3 ? 2 : 1 }, (_, index) => (
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
