import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsersLength,
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-2 border-t text-xs sm:text-sm gap-2"
      aria-label="Pagination"
    >
      <div className="text-gray-600">
        Showing {indexOfFirstUser + 1}-
        {Math.min(indexOfLastUser, filteredUsersLength)} of{" "}
        {filteredUsersLength} users
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          aria-label="Previous page"
        >
          <FiChevronLeft className="sm:mr-1" size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Show pages around current page
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          // On mobile, show only current page and adjacent pages
          const isMobilePage =
            window.innerWidth < 640 &&
            Math.abs(currentPage - pageNum) > 1 &&
            pageNum !== 1 &&
            pageNum !== totalPages;

          if (window.innerWidth < 640 && isMobilePage) {
            return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`w-8 h-8 sm:px-3 sm:py-1 border rounded flex items-center justify-center ${
                currentPage === pageNum
                  ? "bg-primary text-white"
                  : "hover:bg-gray-50"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="sm:ml-1" size={14} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
