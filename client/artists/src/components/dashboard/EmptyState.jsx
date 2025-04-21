import React from "react";
import { Link } from "react-router-dom";
import { FaImages, FaPlus } from "react-icons/fa";

const EmptyState = ({ filter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
      <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
        <FaImages className="text-indigo-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {filter === "all" ? "No Artworks Yet" : `No ${filter} Artworks Yet`}
      </h2>
      <p className="text-gray-600 mb-6">
        {filter === "all"
          ? "You haven't added any artworks to your portfolio yet. Start showcasing your art by adding your first piece."
          : `You don't have any artworks in the ${filter} category. Add some or choose a different category.`}
      </p>
      <Link
        to="/artwork/new"
        className="btn-creative bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-200 inline-flex items-center"
      >
        <FaPlus className="mr-2" />
        Add Your First Artwork
      </Link>
    </div>
  );
};

export default EmptyState;
