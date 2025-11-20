'use client';

import { Button } from "@/components/ui/button";

interface CustomPaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function CustomPagination({ page, pages, onChange }: CustomPaginationProps) {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant={page === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(page + 1, pages))}
          disabled={page === pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}