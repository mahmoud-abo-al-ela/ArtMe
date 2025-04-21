import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 100px
  const toggleVisibility = () => {
    if (window.pageYOffset > 1) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`!focus:outline-none focus:outline-none focus:ring-0 active:outline-none focus-visible:outline-none fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl z-50 transition-all duration-500 ease-in-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
        style={{ outline: "none" }}
      >
        <IoIosArrowUp size={24} />
      </button>
    </>
  );
};

export default BackToTop;
