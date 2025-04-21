import React from "react";
import { FiUsers, FiImage, FiRefreshCw } from "react-icons/fi";

const DashboardHeader = ({
  overallStatus,
  dailyStats,
  onRefreshAll,
  onRefreshStatus,
  refreshing,
  statusRefreshing,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <div className="ml-4 flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                overallStatus === "operational"
                  ? "bg-green-500"
                  : overallStatus === "degraded"
                  ? "bg-yellow-500"
                  : overallStatus === "issues"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            ></span>
            <span className="text-sm font-medium">
              {overallStatus === "operational"
                ? "All Systems Operational"
                : overallStatus === "degraded"
                ? "Performance Degraded"
                : overallStatus === "issues"
                ? "System Issues Detected"
                : "Status Unknown"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshStatus}
            disabled={statusRefreshing}
            title="Refresh system status"
            aria-label="Refresh system status"
            className="cursor-pointer flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <FiRefreshCw
              className={`${statusRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={onRefreshAll}
            disabled={refreshing}
            aria-label="Refresh all dashboard data"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <FiRefreshCw className={`${refreshing ? "animate-spin" : ""}`} />
            Refresh All
          </button>
        </div>
      </div>

      {/* Quick Stats Summary - Last 24 hours */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">
          Last 24 Hours Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center gap-2">
            <FiUsers className="text-indigo-500" />
            <span className="text-sm">
              <span className="font-semibold">
                +{dailyStats?.newUsers || 0}
              </span>{" "}
              New Users
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiImage className="text-amber-500" />
            <span className="text-sm">
              <span className="font-semibold">
                +{dailyStats?.newArtworks || 0}
              </span>{" "}
              New Artworks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
