"use client";

import { useState, useRef, useEffect } from "react";
// import Home1 from "./_components/home-1";
import Home2 from "./_components/home-2";
import Home3 from "./_components/home-3";
import Home4 from "./_components/home-4";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("homeCurrentPage1215");
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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

  const handleNextPage = (page?: number) => {
    if (page) {
      setCurrentPage(page);
    } else if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("homeCurrentPage1215", currentPage.toString());
  }, [currentPage]);

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

        {/* Page 3 */}
        <Home3 onNext={handleNextPage} />

        {/* Page 2 */}
        <Home2 onNext={handleNextPage} />

        {/* Page 4 */}
        <Home4 />
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
