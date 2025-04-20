import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Pagination({ currentPage, totalItems, itemsPerPage, paginate }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems <= itemsPerPage) {
    return null; // Don't show pagination if all items fit on one page
  }

  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center">
        <div
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          className={`px-3 py-1 rounded-md mr-2 bg-gray-100 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-200 transition-colors"
          }`}
        >
          <FaArrowLeft
            className={`${
              currentPage === 1 ? "text-gray-400" : "text-gray-700"
            }`}
          />
        </div>

        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded-md cursor-pointer ${
              currentPage === index + 1
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            }`}
          >
            {index + 1}
          </div>
        ))}

        <div
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          className={`px-3 py-1 rounded-md ml-2 bg-gray-100 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-200 transition-colors"
          }`}
        >
          <FaArrowRight
            className={`${
              currentPage === totalPages ? "text-gray-400" : "text-gray-700"
            }`}
          />
        </div>
      </nav>
    </div>
  );
}

export default Pagination;
