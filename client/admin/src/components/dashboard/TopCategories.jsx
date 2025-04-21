import React from "react";
import { FiBarChart2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const TopCategories = ({ categories, minimized, setMinimized }) => {
  return (
    <motion.div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 ">
      <div
        className={`flex justify-between items-center p-4 border-b cursor-pointer ${
          minimized ? "border-b-0" : ""
        }`}
        onClick={() => setMinimized(!minimized)}
        aria-label={minimized ? "Expand" : "Minimize"}
        title={minimized ? "Expand" : "Minimize"}
      >
        <div className="flex items-center">
          <FiBarChart2 className="text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Top Categories</h3>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
          {minimized ? (
            <FiChevronDown className="text-gray-500" />
          ) : (
            <FiChevronUp className="text-gray-500" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category._id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category.count} artworks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (category.count /
                              Math.max(...categories.map((c) => c.count))) *
                              100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-2.5 rounded-full ${
                          index === 0
                            ? "bg-indigo-600"
                            : index === 1
                            ? "bg-green-500"
                            : index === 2
                            ? "bg-amber-500"
                            : index === 3
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        }`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopCategories;
