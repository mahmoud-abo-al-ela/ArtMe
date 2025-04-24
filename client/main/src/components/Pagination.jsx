import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Pagination({ currentPage, totalItems, itemsPerPage, paginate }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems <= itemsPerPage) {
    return null; // Don't show pagination if all items fit on one page
  }

  // Helper function to create page numbers with ellipsis for responsive design
  const getPageNumbers = () => {
    let pageNumbers = [];

    // For small number of pages, show all
    if (totalPages <= 5) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of current window
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed before current window
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add pages in current window
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed after current window
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // For mobile devices, simplify the pagination further
  const getMobilePageNumbers = () => {
    let pageNumbers = [];

    // On mobile, just show current, previous, and next when applicable
    if (currentPage > 1) {
      pageNumbers.push(currentPage - 1);
    }

    pageNumbers.push(currentPage);

    if (currentPage < totalPages) {
      pageNumbers.push(currentPage + 1);
    }

    return pageNumbers;
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center justify-center">
      <nav className="flex flex-wrap items-center justify-center">
        {/* Previous button - enhanced for mobile */}
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          className={`w-10 h-10 sm:w-10 sm:h-10 md:w-auto md:h-auto md:px-3 md:py-1 rounded-md mr-2 md:mr-2 ${
            currentPage === 1
              ? "bg-gray-100 opacity-50 cursor-not-allowed"
              : "bg-indigo-100 cursor-pointer hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
          }`}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaArrowLeft
            className={`text-sm sm:text-sm md:text-base ${
              currentPage === 1 ? "text-gray-400" : "text-indigo-600"
            }`}
          />
        </button>

        {/* Page numbers - Desktop and Tablet */}
        <div className="hidden sm:flex flex-wrap justify-center">
          {getPageNumbers().map((page, index) => (
            <div
              key={index}
              onClick={() => typeof page === "number" && paginate(page)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mx-1 rounded-md text-sm md:text-base ${
                page === "..."
                  ? "bg-transparent cursor-default"
                  : currentPage === page
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              }`}
            >
              {page}
            </div>
          ))}
        </div>

        {/* Simplified Page numbers - Mobile Only with larger touch targets */}
        <div className="flex sm:hidden flex-wrap justify-center">
          {getMobilePageNumbers().map((page, index) => (
            <div
              key={index}
              onClick={() => paginate(page)}
              className={`w-10 h-10 flex items-center justify-center mx-1 rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
              }`}
            >
              {page}
            </div>
          ))}
        </div>

        {/* Next button - enhanced for mobile */}
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          className={`w-10 h-10 sm:w-10 sm:h-10 md:w-auto md:h-auto md:px-3 md:py-1 rounded-md ml-2 md:ml-2 ${
            currentPage === totalPages
              ? "bg-gray-100 opacity-50 cursor-not-allowed"
              : "bg-indigo-100 cursor-pointer hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
          }`}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FaArrowRight
            className={`text-sm sm:text-sm md:text-base ${
              currentPage === totalPages ? "text-gray-400" : "text-indigo-600"
            }`}
          />
        </button>
      </nav>

      {/* Enhanced Page indicator for mobile screens */}
      <div className="w-full text-center mt-3 text-sm text-gray-600 sm:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

export default Pagination;
