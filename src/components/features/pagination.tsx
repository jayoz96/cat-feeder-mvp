"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  pageSize: number;
  basePath: string;
}

export function Pagination({ total, pageSize, basePath }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  function go(page: number) {
    router.push(`${basePath}?page=${page}`);
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === current ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => go(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={current >= totalPages}
        onClick={() => go(current + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
