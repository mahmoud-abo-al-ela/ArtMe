import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import api from "../utils/api";

// Import components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import StatusCard from "../components/dashboard/StatusCard";
import TopCategories from "../components/dashboard/TopCategories";
import ActivityTable from "../components/dashboard/ActivityTable";
import LoadingScreen from "../components/common/LoadingScreen";
import NotificationSystem from "../components/dashboard/NotificationSystem";

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    artworkCount: 0,
    dailyStats: {
      newUsers: 0,
      newArtworks: 0,
    },
    weeklyUserGrowth: [],
    weeklyArtworkGrowth: [],
    topCategories: [],
    recentActivity: [],
    systemStatus: {
      api: "healthy",
      database: "healthy",
      lastUpdated: new Date().toISOString(),
    },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusRefreshing, setStatusRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activityFilter, setActivityFilter] = useState("all");
  const [topCategoriesMinimized, setTopCategoriesMinimized] = useState(false);
  const [statusMinimized, setStatusMinimized] = useState(false);
  const [recentActivitiesMinimized, setRecentActivitiesMinimized] =
    useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dashboardRef = useRef(null);

  // Handle resize events to track device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter activities based on the selected filter
  const filteredActivities = useMemo(() => {
    if (!stats.recentActivity || stats.recentActivity.length === 0) {
      return [];
    }

    if (activityFilter === "all") {
      return stats.recentActivity;
    } else if (activityFilter === "user") {
      return stats.recentActivity.filter((activity) =>
        activity.action.toLowerCase().includes("user")
      );
    } else if (activityFilter === "artwork") {
      return stats.recentActivity.filter((activity) =>
        activity.action.toLowerCase().includes("artwork")
      );
    }

    return stats.recentActivity;
  }, [stats.recentActivity, activityFilter]);

  // Notification system
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
      showNotification("Dashboard data refreshed successfully");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showNotification("Failed to refresh dashboard data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showNotification]);

  // Separate function to just fetch system status - more lightweight
  const fetchSystemStatus = useCallback(async () => {
    try {
      setStatusRefreshing(true);
      const response = await api.get("/admin/system-status");

      // Use the state setter with function to access previous state
      // without creating a dependency on stats.systemStatus
      setStats((prevStats) => {
        const prevStatus = prevStats.systemStatus;
        const newStatus = response.data;

        // Check for degraded or down states that are new
        if (prevStatus && newStatus) {
          if (prevStatus.api === "healthy" && newStatus.api !== "healthy") {
            showNotification(
              `API status changed to ${newStatus.api}`,
              "warning"
            );
          }
          if (
            prevStatus.database === "healthy" &&
            newStatus.database !== "healthy"
          ) {
            showNotification(
              `Database status changed to ${newStatus.database}`,
              "warning"
            );
          }
        }

        return {
          ...prevStats,
          systemStatus: newStatus,
        };
      });
      showNotification("System status refreshed successfully");
    } catch (error) {
      console.error("Error fetching system status:", error);
      showNotification("Failed to refresh system status", "error");
    } finally {
      setStatusRefreshing(false);
    }
  }, [showNotification]); // Only depend on showNotification

  // Calculate overall system status - memoized to prevent recalculation on every render
  const getOverallStatus = useCallback(() => {
    if (!stats.systemStatus) return "unknown";

    const { api, database } = stats.systemStatus;
    if (api === "down" || database === "down") {
      return "issues";
    } else if (api === "degraded" || database === "degraded") {
      return "degraded";
    } else {
      return "operational";
    }
  }, [stats.systemStatus]);

  // Function to format date if it exists
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleTimeString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // Calculate time since last update
  const getTimeSinceUpdate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      // Format the date in a static readable format instead of a relative time
      return formatDate(dateString);
    } catch (e) {
      return "Unknown";
    }
  };

  // Memoize system status
  const overallStatus = useMemo(() => getOverallStatus(), [getOverallStatus]);

  // Handle scroll events to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Initial fetch of dashboard data
    fetchDashboardData();
    return () => {};
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingScreen msg="dashboard" />;
  }

  return (
    <div ref={dashboardRef} className="pb-16 relative max-w-full">
      {/* Notification System */}
      <NotificationSystem notification={notification} />

      {/* Dashboard Header */}
      <DashboardHeader
        overallStatus={overallStatus}
        dailyStats={stats.dailyStats}
        onRefreshAll={fetchDashboardData}
        onRefreshStatus={fetchSystemStatus}
        refreshing={refreshing}
        statusRefreshing={statusRefreshing}
        isMobile={isMobile}
      />

      {/* Dashboard Content - Use responsive grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Main Stats Cards */}
        <StatsCard
          userCount={stats.userCount}
          artworkCount={stats.artworkCount}
          dailyStats={stats.dailyStats}
        />

        {/* System Status Section */}
        {stats.systemStatus && (
          <StatusCard
            systemStatus={stats.systemStatus}
            overallStatus={overallStatus}
            formatDate={formatDate}
            getTimeSinceUpdate={getTimeSinceUpdate}
            minimized={statusMinimized}
            setMinimized={setStatusMinimized}
            isMobile={isMobile}
          />
        )}

        {/* Layout for Top Categories and Recent Activity for larger screens */}
        <div
          className={`grid grid-cols-1 ${
            isMobile ? "lg:grid-cols-2" : ""
          } gap-6`}
        >
          {/* Top Categories Section */}
          {stats.topCategories && stats.topCategories.length > 0 && (
            <TopCategories
              categories={stats.topCategories}
              minimized={topCategoriesMinimized}
              setMinimized={setTopCategoriesMinimized}
              isMobile={isMobile}
            />
          )}

          {/* Recent Activity Table */}
          <ActivityTable
            activities={filteredActivities}
            minimized={recentActivitiesMinimized}
            setMinimized={setRecentActivitiesMinimized}
            activityFilter={activityFilter}
            setActivityFilter={setActivityFilter}
            formatDate={formatDate}
            onRefresh={fetchDashboardData}
            refreshing={refreshing}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
