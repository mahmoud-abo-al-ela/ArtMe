import React from "react";
import {
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiImage,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ActivityTable = ({
  activities,
  minimized,
  setMinimized,
  activityFilter,
  setActivityFilter,
  formatDate,
  onRefresh,
  refreshing,
}) => {
  return (
    <motion.div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className={`flex justify-between items-center p-4 border-b cursor-pointer ${
          minimized ? "border-b-0" : ""
        }`}
        onClick={() => setMinimized(!minimized)}
        aria-label={minimized ? "Expand" : "Minimize"}
        title={minimized ? "Expand" : "Minimize"}
      >
        <div className="flex items-center">
          <FiActivity className="text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Activity Filter */}
          <div
            className="flex items-center mr-2 cursor-pointer bg-gray-100 rounded-md p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <select
              className="text-xs rounded-md py-1 pr-8 pl-3 text-gray-700 focus:outline-none"
              onChange={(e) => setActivityFilter(e.target.value)}
              value={activityFilter}
            >
              <option value="all">All Activity</option>
              <option value="user">User Activity</option>
              <option value="artwork">Artwork Activity</option>
            </select>
          </div>

          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {activities.length} entries
          </span>
          {activities.length > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Latest: {formatDate(new Date(activities[0]?.date).toISOString())}
            </span>
          )}

          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors ml-2">
            {minimized ? (
              <FiChevronDown className="text-gray-500" />
            ) : (
              <FiChevronUp className="text-gray-500" />
            )}
          </button>
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
            <div className="overflow-x-auto">
              {activities.length > 0 ? (
                <>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {activities.map((activity, index) => {
                        // Group activities by date
                        const showDateHeader =
                          index === 0 ||
                          new Date(activity.date).toDateString() !==
                            new Date(activities[index - 1].date).toDateString();

                        return (
                          <React.Fragment key={activity.id || index}>
                            {showDateHeader && (
                              <tr className="bg-gray-50">
                                <td
                                  colSpan="4"
                                  className="px-6 py-2 text-xs font-medium text-gray-500"
                                >
                                  {(() => {
                                    const date = new Date(activity.date);
                                    const today = new Date();
                                    const yesterday = new Date(today);
                                    yesterday.setDate(yesterday.getDate() - 1);

                                    if (
                                      date.toDateString() ===
                                      today.toDateString()
                                    ) {
                                      return "Today";
                                    } else if (
                                      date.toDateString() ===
                                      yesterday.toDateString()
                                    ) {
                                      return "Yesterday";
                                    } else {
                                      return date.toLocaleDateString(
                                        undefined,
                                        {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      );
                                    }
                                  })()}
                                </td>
                              </tr>
                            )}
                            <motion.tr
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: Math.min(index * 0.05, 0.5),
                              }}
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.02)",
                              }}
                              className="transition-all cursor-pointer hover:shadow-sm"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                  <div
                                    className={`p-2 rounded-lg mr-3 ${
                                      activity.action.includes("User")
                                        ? "bg-indigo-100"
                                        : activity.action.includes("Artwork")
                                        ? "bg-amber-100"
                                        : "bg-blue-100"
                                    }`}
                                  >
                                    {activity.action.includes("User") ? (
                                      <FiUsers className="text-indigo-500" />
                                    ) : activity.action.includes("Artwork") ? (
                                      <FiImage className="text-amber-500" />
                                    ) : (
                                      <FiActivity className="text-blue-500" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {activity.action}
                                    </div>
                                    {activity.details && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {activity.action.includes("User")
                                          ? activity.details.name
                                            ? `Name: ${activity.details.name}`
                                            : ""
                                          : activity.details.title
                                          ? `${activity.details.title}${
                                              activity.details.category
                                                ? ` (${activity.details.category})`
                                                : ""
                                            }`
                                          : ""}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-2">
                                    {activity.user
                                      ? activity.user.charAt(0).toUpperCase()
                                      : "?"}
                                  </div>
                                  <span className="text-gray-800">
                                    {activity.user || "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <time
                                  dateTime={activity.date}
                                  className="flex items-center"
                                >
                                  <FiClock className="mr-1 text-gray-400" />
                                  {new Date(activity.date).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </time>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                                    activity.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : activity.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {activity.status || "completed"}
                                </span>
                              </td>
                            </motion.tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination Controls - For if we had more than shown on the page */}
                  {activities.length > 5 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                      <div className="flex-1 flex justify-between items-center">
                        <button
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          disabled={true}
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-500">
                          Page <span className="font-medium">1</span> of{" "}
                          <span className="font-medium">1</span>
                        </span>
                        <button
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          disabled={true}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-10 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-gray-100 mb-3">
                      <FiActivity className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                      No activity yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      There's no recent activity to display. New user
                      registrations and artwork uploads will appear here.
                    </p>
                    <button
                      onClick={onRefresh}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                      disabled={refreshing}
                    >
                      <FiRefreshCw
                        className={`inline mr-2 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      Refresh Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivityTable;
