import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const Pagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col items-center space-y-2 sm:space-y-3">
      <p className="text-xs sm:text-sm text-gray-500">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}{" "}
        of {totalItems} artworks
      </p>
      <div
        className="inline-flex rounded-md shadow-sm w-full sm:w-auto flex-wrap justify-center"
        role="navigation"
        aria-label="Pagination"
      >
        <button
          onClick={() =>
            currentPage > 1 && setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={currentPage === 1}
          className={`flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer border border-gray-200"
          }`}
          aria-disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaArrowLeft className="text-xs sm:text-sm" />
        </button>

        <div className="hidden sm:flex border-t border-b border-gray-200">
          {Array.from({
            length: pageCount,
          }).map((_, index) => {
            const pageNum = index + 1;
            // Smart pagination: show current page, first/last pages, and neighbors
            const showPage =
              pageNum === currentPage ||
              pageNum === 1 ||
              pageNum === pageCount ||
              pageNum === currentPage - 1 ||
              pageNum === currentPage + 1;

            // Show ellipsis for gaps
            if (!showPage) {
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span
                    key={`ellipsis-${pageNum}`}
                    className="flex items-center justify-center w-8 sm:w-10 text-xs sm:text-sm font-medium text-gray-500 border-r border-gray-200 bg-white"
                    aria-hidden="true"
                  >
                    <span className="w-1 h-1 mx-0.5 rounded-full bg-gray-400"></span>
                    <span className="w-1 h-1 mx-0.5 rounded-full bg-gray-400"></span>
                    <span className="w-1 h-1 mx-0.5 rounded-full bg-gray-400"></span>
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex items-center justify-center w-8 sm:w-10 text-xs sm:text-sm font-medium border-r border-gray-200 transition-all duration-200 ${
                  currentPage === pageNum
                    ? "bg-indigo-600 text-white border-indigo-600 relative z-10 hover:bg-indigo-700"
                    : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <div className="sm:hidden flex items-center justify-center px-3 border-t border-b border-gray-200 bg-white">
          <span className="text-xs font-medium text-gray-700">
            {currentPage} of {pageCount}
          </span>
        </div>

        <button
          onClick={() =>
            currentPage < pageCount &&
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
          className={`flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md transition-all duration-200 ${
            currentPage === pageCount
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer border border-gray-200"
          }`}
          aria-disabled={currentPage === pageCount}
          aria-label="Next page"
        >
          <FaArrowRight className="text-xs sm:text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
