import React from "react";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiBell,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const NotificationSystem = ({ notification }) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === "error"
            ? "bg-red-100 text-red-800 border-l-4 border-red-500"
            : notification.type === "warning"
            ? "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
            : notification.type === "info"
            ? "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
            : "bg-green-100 text-green-800 border-l-4 border-green-500"
        }`}
      >
        <span className="mr-2">
          {notification.type === "error" ? (
            <FiAlertCircle className="text-red-500" />
          ) : notification.type === "warning" ? (
            <FiAlertTriangle className="text-yellow-500" />
          ) : notification.type === "info" ? (
            <FiBell className="text-blue-500" />
          ) : (
            <FiCheckCircle className="text-green-500" />
          )}
        </span>
        {notification.message}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationSystem;
