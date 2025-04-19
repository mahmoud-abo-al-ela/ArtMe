import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.jpg";
import img3 from "../assets/images/img3.jpg";
import img4 from "../assets/images/img4.jpg";
import { FaArrowRight } from "react-icons/fa";
import ArtworkCard from "../components/ArtworkCard";
import FullImageView from "../components/FullImageView";
import LoadingSpinner from "../components/LoadingSpinner";
function Home() {
  const [artworks, setArtworks] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, artistsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/artworks?limit=6`),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/artists?featured=true&limit=3`
          ),
        ]);

        setArtworks(artworksRes.data);
        setFeaturedArtists(artistsRes.data);
        setLoading(false);

        // Initialize loading state for all artwork images
        const initialLoadingState = {};
        artworksRes.data.forEach((artwork) => {
          initialLoadingState[artwork._id] = true;
        });
        setLoadingImages(initialLoadingState);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleImageError = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleImageClick = (artwork) => {
    setFullImage(artwork);
  };

  const closeFullImage = () => {
    setFullImage(null);
  };

  const setShowDeleteConfirm = () => {
    // This is a placeholder. In the Home page, we probably don't want to enable deletion
    console.log("Delete functionality not implemented in Home page");
    closeFullImage();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[85vh] bg-gray-50">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="overflow-hidden bg-gray-50 font-sans">
      {fullImage && (
        <FullImageView
          fullImage={fullImage}
          closeFullImage={closeFullImage}
          loadingImages={loadingImages}
          handleImageLoad={handleImageLoad}
          handleImageError={handleImageError}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}

      {/* Hero Section */}
      <section
        className="text-white h-screen"
        aria-label="Hero Section"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3290&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="w-full mx-auto h-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 lg:pr-12"
          >
            <h1 className="!text-7xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 leading-tight">
              Discover Extraordinary Artwork
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-md">
              Explore a curated collection of stunning artworks and connect with
              talented artists.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/gallery"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-lg text-indigo-900 bg-white hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Explore the art gallery"
                >
                  Explore Gallery
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/artists"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg !text-gray-300 bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="View featured artists"
                >
                  Meet Artists
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Artworks */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        aria-label="Recent Artworks"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative">
              Recent Artworks
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-indigo-600 rounded-full"></span>
            </h2>
            <Link
              to="/gallery"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 group focus:outline-none focus:underline"
              aria-label="View all artworks in the gallery"
            >
              View All
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artworks.map((artwork, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                key={artwork._id}
              >
                <ArtworkCard
                  artwork={artwork}
                  loadingImages={loadingImages}
                  handleImageClick={handleImageClick}
                  handleImageLoad={handleImageLoad}
                  handleImageError={handleImageError}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Artist CTA */}
      <section
        className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white relative overflow-hidden"
        aria-label="Artist Call to Action"
      >
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Are You an Artist?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join our vibrant community of creators. Showcase your artwork,
            connect with enthusiasts, and grow your audience.
          </p>
          <a
            href="https://artists.artportfolio.com/register"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg shadow-lg text-indigo-900 bg-white hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Join as an artist"
          >
            Join as an Artist
          </a>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
