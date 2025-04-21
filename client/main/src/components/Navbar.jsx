import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to check if link is active
  const isActive = (path) => {
    if (path === "/artists") {
      return (
        location.pathname === path || location.pathname.startsWith("/artists/")
      );
    }
    return location.pathname === path;
  };

  // Mobile menu animation styles
  const mobileMenuStyle = {
    animation: "slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
  };

  return (
    <nav
      className={`fixed w-full z-50 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-2"
          : "bg-transparent py-4"
      } ${isActive("/") ? "py-2" : "border-b border-gray-200"}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className={`h-8 w-8 ${
                isScrolled || !isActive("/") ? "text-indigo-600" : "text-white"
              }`}
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
            <span
              className={`ml-2 pb-1 text-3xl font-bold ${
                isScrolled || !isActive("/")
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "text-white"
              }`}
            >
              ArtMe
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className={`font-medium px-3 py-2 transition-all duration-300 rounded-md ${
                isActive("/")
                  ? isScrolled || !isActive("/")
                    ? "text-white bg-indigo-600 shadow-md hover:bg-indigo-700"
                    : "text-indigo-100 bg-white/20 backdrop-blur-sm shadow-lg"
                  : isScrolled || !isActive("/")
                  ? "text-gray-800 hover:text-indigo-600"
                  : "text-white hover:text-indigo-200 hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`font-medium px-3 py-2 transition-all duration-300 rounded-md ${
                isActive("/gallery")
                  ? isScrolled || !isActive("/")
                    ? "text-white bg-indigo-600 shadow-md hover:bg-indigo-700"
                    : "text-indigo-100 bg-white/20 backdrop-blur-sm shadow-lg"
                  : isScrolled || !isActive("/")
                  ? "text-gray-800 hover:text-indigo-600"
                  : "text-white hover:text-indigo-200 hover:bg-white/10"
              }`}
            >
              Artworks
            </Link>
            <Link
              to="/artists"
              className={`font-medium px-3 py-2 transition-all duration-300 rounded-md ${
                isActive("/artists")
                  ? isScrolled || !isActive("/")
                    ? "text-white bg-indigo-600 shadow-md hover:bg-indigo-700"
                    : "text-indigo-100 bg-white/20 backdrop-blur-sm shadow-lg"
                  : isScrolled || !isActive("/")
                  ? "text-gray-800 hover:text-indigo-600"
                  : "text-white hover:text-indigo-200 hover:bg-white/10"
              }`}
            >
              Artists
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-indigo-800 hover:text-indigo-600 hover:bg-indigo-100/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  : "text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    className="animate-fade-in"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                    className="animate-fade-in"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            className={`lg:hidden mt-5 pt-4 pb-6 rounded-xl shadow-xl ${
              isScrolled
                ? "bg-white/95 backdrop-blur-lg border-t border-indigo-100"
                : "bg-gray-900/80 backdrop-blur-lg border border-white/10"
            }`}
            style={mobileMenuStyle}
          >
            <Link
              to="/"
              className={`block py-3 px-6 text-lg rounded-lg mx-2 mb-2 font-medium transition-all duration-300 ${
                isActive("/")
                  ? isScrolled
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white/20 text-white font-semibold"
                  : isScrolled
                  ? "text-gray-800 hover:bg-gray-100 hover:text-indigo-600"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`block py-3 px-6 text-lg rounded-lg mx-2 mb-2 font-medium transition-all duration-300 ${
                isActive("/gallery")
                  ? isScrolled
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white/20 text-white font-semibold"
                  : isScrolled
                  ? "text-gray-800 hover:bg-gray-100 hover:text-indigo-600"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/artists"
              className={`block py-3 px-6 text-lg rounded-lg mx-2 mb-2 font-medium transition-all duration-300 ${
                isActive("/artists")
                  ? isScrolled
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white/20 text-white font-semibold"
                  : isScrolled
                  ? "text-gray-800 hover:bg-gray-100 hover:text-indigo-600"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Artists
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
