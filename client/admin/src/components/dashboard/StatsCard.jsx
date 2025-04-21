import React from "react";
import { FiUsers, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";

const StatsCard = ({ userCount, artworkCount }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      {/* Main Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex items-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mr-4">
            <FiUsers className="text-2xl text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-800">
              {userCount.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex items-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mr-4">
            <FiImage className="text-2xl text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Total Artworks
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {artworkCount.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default StatsCard;
