import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-block animate-spin mb-4">
          <FiRefreshCw className="text-4xl text-primary" />
        </div>
        <p className="text-text-light">Loading dashboard data...</p>
        <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
