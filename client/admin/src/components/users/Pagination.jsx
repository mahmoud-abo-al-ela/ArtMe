import React from "react";

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
      className="flex justify-between items-center mt-4 text-sm"
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
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
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

          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`px-3 py-1 border rounded ${
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
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
