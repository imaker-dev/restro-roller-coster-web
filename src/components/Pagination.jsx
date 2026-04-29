import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = false,
  showingText = true,
  className = "",
  maxPageNumbers = 5,
}) {
  const [pageNumbers, setPageNumbers] = useState([]);

  // Calculate showing text values
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  useEffect(() => {
    const generatePageNumbers = () => {
      if (totalPages <= 1) return [];
      if (totalPages <= maxPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages = [];
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      // Always add the first page
      pages.push(1);

      // Add left ellipsis if needed
      if (leftBound > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      // Add right ellipsis if needed
      if (rightBound < totalPages - 1) {
        pages.push("...");
      }

      // Always add the last page
      pages.push(totalPages);

      return pages;
    };

    setPageNumbers(generatePageNumbers());
  }, [currentPage, totalPages, maxPageNumbers]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}
    >
      {/* Showing text */}
      {showingText && (
        <div className="text-sm text-gray-500">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </>
          ) : (
            <span>No results found</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 mr-4">
            <label htmlFor="page-size" className="text-sm text-gray-500">
              Show:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="form-select"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* First page button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="First page"
            title="First page"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-gray-500 select-none"
                  title="More pages"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[36px] h-9 flex items-center justify-center rounded-md mx-0.5 text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  title={`Go to page ${page}`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>

          {/* Last page button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="Last page"
            title="Last page"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
