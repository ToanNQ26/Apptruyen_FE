import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {

  const getPages = () => {
    const pages: (number | string)[] = [];

    pages.push(1);

    if (page > 4) pages.push("...");

    for (
      let i = Math.max(2, page - 2);
      i <= Math.min(totalPages - 1, page + 2);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 3) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return [...new Set(pages)];
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-1">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-9 w-9 rounded-md border disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronLeft size={18} className="mx-auto" />
        </button>

        {getPages().map((item, idx) =>
          item === "..." ? (
            <span
              key={idx}
              className="px-3 text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(Number(item))}
              className={`
                h-9 min-w-9 px-3 rounded-md border text-sm transition
                ${
                  page === item
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {item}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-9 w-9 rounded-md border disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronRight size={18} className="mx-auto" />
        </button>

      </div>
    </div>
  );
}