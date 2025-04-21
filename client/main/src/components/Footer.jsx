import { useState, useEffect } from "react";

function Footer() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gradient animation style
  const gradientStyle = {
    backgroundSize: "300% 300%",
    animation: "gradient 15s ease infinite",
  };

  return (
    <footer
      className={`w-full transition-all duration-500 py-3 border-t border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center font-medium text-indigo-800">
          &copy; {new Date().getFullYear()}
          <span className="ml-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            ArtMe
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
