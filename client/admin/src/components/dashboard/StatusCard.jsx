import React from "react";
import {
  FiServer,
  FiClock,
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const StatusCard = ({
  systemStatus,
  overallStatus,
  formatDate,
  getTimeSinceUpdate,
  minimized,
  setMinimized,
  isMobile,
}) => {
  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <FiCheckCircle className="text-green-500" />;
      case "degraded":
        return <FiAlertTriangle className="text-yellow-500" />;
      case "down":
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiServer className="text-gray-500" />;
    }
  };

  return (
    <motion.div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 md:mb-8">
      <div
        className="flex justify-between items-center p-3 md:p-4 border-b cursor-pointer"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center">
          <FiServer className="text-gray-500 mr-2" />
          <h3 className="text-md md:text-lg font-medium text-gray-800">
            System Status
          </h3>
          {overallStatus !== "operational" && (
            <span className="ml-2 inline-flex animate-pulse">
              <FiBell
                className={
                  overallStatus === "issues"
                    ? "text-red-500"
                    : "text-yellow-500"
                }
              />
            </span>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-xs md:text-sm text-gray-500 mr-2">
            <FiClock className="mr-1" />
            <span className={isMobile ? "hidden sm:inline" : ""}>
              Updated{" "}
              <time
                dateTime={systemStatus.lastUpdated}
                title={formatDate(systemStatus.lastUpdated)}
                className="font-medium"
              >
                {getTimeSinceUpdate(systemStatus.lastUpdated)}
              </time>
            </span>
            <span className={isMobile ? "sm:hidden" : "hidden"}>
              <time
                dateTime={systemStatus.lastUpdated}
                title={formatDate(systemStatus.lastUpdated)}
                className="font-medium"
              >
                {getTimeSinceUpdate(systemStatus.lastUpdated)}
              </time>
            </span>
          </div>
          {minimized ? <FiChevronDown /> : <FiChevronUp />}
        </div>
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
            <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {systemStatus.api && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg p-3 md:p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FiServer className="text-gray-500 mr-2 md:mr-3" />
                    <span className="font-medium text-sm md:text-base">
                      API Services
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.api)}
                    <span className="ml-2 text-xs md:text-sm font-medium">
                      {systemStatus.api.charAt(0).toUpperCase() +
                        systemStatus.api.slice(1)}
                    </span>
                    <span
                      className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(
                        systemStatus.api
                      )} ${
                        systemStatus.api !== "healthy" ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </div>
                </motion.div>
              )}

              {systemStatus.database && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg p-3 md:p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FiServer className="text-gray-500 mr-2 md:mr-3" />
                    <span className="font-medium text-sm md:text-base">
                      Database
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.database)}
                    <span className="ml-2 text-xs md:text-sm font-medium">
                      {systemStatus.database.charAt(0).toUpperCase() +
                        systemStatus.database.slice(1)}
                    </span>
                    <span
                      className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(
                        systemStatus.database
                      )} ${
                        systemStatus.database !== "healthy"
                          ? "animate-pulse"
                          : ""
                      }`}
                    ></span>
                  </div>
                </motion.div>
              )}

              {/* Display any additional system components dynamically */}
              {systemStatus &&
                Object.entries(systemStatus).map(([key, value]) => {
                  // Skip the ones we've already rendered and lastUpdated
                  if (
                    key === "api" ||
                    key === "database" ||
                    key === "lastUpdated"
                  ) {
                    return null;
                  }

                  // Only render if value is a string (status value)
                  if (typeof value === "string") {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={key}
                        className="border rounded-lg p-3 md:p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <FiServer className="text-gray-500 mr-2 md:mr-3" />
                          <span className="font-medium text-sm md:text-base">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(value)}
                          <span className="ml-2 text-xs md:text-sm font-medium">
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                          <span
                            className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(
                              value
                            )} ${value !== "healthy" ? "animate-pulse" : ""}`}
                          ></span>
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatusCard;
