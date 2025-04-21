/**
 * Format a date for display
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  try {
    const date = new Date(dateString);

    const defaultOptions = {
      includeTime: false,
      locale: "en-US",
      ...options,
    };

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Date portion formatting
    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    // Add time if requested
    if (defaultOptions.includeTime) {
      return date.toLocaleString(defaultOptions.locale, {
        ...dateOptions,
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString(defaultOptions.locale, dateOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return "just now";
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    // Use standard formatting for older dates
    return formatDate(date);
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Unknown time";
  }
};
