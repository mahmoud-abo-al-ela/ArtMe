import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle touch swipe to close menu
  const handleTouchStart = useRef({ x: 0, y: 0 });
  const handleTouchMove = (e) => {
    if (!mobileMenuOpen) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - handleTouchStart.current.x;

    if (deltaX < -50) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-indigo-600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z"
                  fill="currentColor"
                />
                <path
                  d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z"
                  fill="currentColor"
                />
                <path
                  d="M15 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13Z"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-2 pb-1 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                ArtMe
              </span>
            </Link>
            <a
              href={import.meta.env.VITE_MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-6 text-gray-600 hover:text-indigo-600 text-sm hidden sm:block transition-colors duration-200"
            >
              Visit Main Site
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/dashboard") ? "text-indigo-600" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/artwork/new"
                  className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/artwork/new") ? "text-indigo-600" : ""
                  }`}
                >
                  Add Artwork
                </Link>
                <Link
                  to="/profile"
                  className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/profile") ? "text-indigo-600" : ""
                  }`}
                >
                  My Profile
                </Link>
                <div
                  onClick={handleLogout}
                  className="btn-creative text-sm cursor-pointer transform hover:scale-105 transition-transform duration-200"
                >
                  Logout
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <div
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200 active:scale-90"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "opacity-0 absolute rotate-90"
                    : "opacity-100 rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 absolute -rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed h-screen inset-0 bg-black opacity-35 backdrop-blur-sm sm:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{ touchAction: "none" }}
        ></div>
      )}

      {/* Mobile menu */}
      <div
        ref={menuRef}
        onTouchStart={(e) => {
          handleTouchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchMove={handleTouchMove}
        className={`sm:hidden fixed right-0 top-0 w-4/5 max-w-xs h-screen overflow-y-auto bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="text-lg font-semibold text-indigo-600">Menu</div>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>
        <div className="px-3 py-4 space-y-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                    isActive("/dashboard")
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-3m-3-6h-4"
                  ></path>
                </svg>
                <span>Dashboard</span>
                {isActive("/dashboard") && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </Link>

              <Link
                to="/artwork/new"
                className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive("/artwork/new")
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                    isActive("/artwork/new")
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <span>Add Artwork</span>
                {isActive("/artwork/new") && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </Link>

              <Link
                to="/profile"
                className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive("/profile")
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                    isActive("/profile")
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>My Profile</span>
                {isActive("/profile") && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </Link>

              <div className="h-px bg-gray-200 my-4"></div>

              <div
                onClick={handleLogout}
                className="group flex w-full items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Logout</span>
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              <a
                href={import.meta.env.VITE_MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
                <span>Visit Main Site</span>
              </a>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="group flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="group flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  ></path>
                </svg>
                <span>Register</span>
              </Link>

              <div className="h-px bg-gray-200 my-4"></div>

              <a
                href={import.meta.env.VITE_MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
                <span>Visit Main Site</span>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
