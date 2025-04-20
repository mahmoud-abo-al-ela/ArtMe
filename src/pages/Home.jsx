import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import ArtworkCard from "../components/ArtworkCard";
import FullImageView from "../components/FullImageView";
import LoadingSpinner from "../components/LoadingSpinner";
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const [artworks, setArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 50,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, topArtistsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/artworks?limit=6`),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/artists?sort=artworks&limit=3`
          ),
        ]);

        setArtworks(artworksRes.data);
        setTopArtists(topArtistsRes.data);
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
          <div
            className="lg:w-1/2 lg:pr-12"
            data-aos="fade-right"
            data-aos-delay="200"
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
          </div>
        </div>
      </section>

      {/* Recent Artworks */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className="flex justify-between items-end mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div>
              <h2 className="text-3xl font-display font-semibold text-gray-900">
                Recent Artworks
              </h2>
              <p className="text-gray-500 mt-2">
                Explore our latest additions to the gallery
              </p>
            </div>
            <Link
              to="/gallery"
              className="text-indigo-600 font-medium inline-flex items-center hover:underline"
            >
              View All
              <FaArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: true }}
              className="mySwiper"
            >
              {artworks.map((artwork, index) => (
                <SwiperSlide key={artwork._id}>
                  <ArtworkCard
                    artwork={artwork}
                    loadingImages={loadingImages}
                    handleImageClick={handleImageClick}
                    handleImageLoad={handleImageLoad}
                    handleImageError={handleImageError}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Artists Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className="flex justify-between items-end mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div>
              <h2 className="text-3xl font-display font-semibold text-gray-900">
                Featured Artists
              </h2>
              <p className="text-gray-500 mt-2">
                Meet the talented creators behind the artwork
              </p>
            </div>
            <Link
              to="/artists"
              className="text-indigo-600 font-medium inline-flex items-center hover:underline"
            >
              View All
              <FaArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topArtists.slice(0, 3).map((artist, index) => (
              <Link
                to={`/artists/${encodeURIComponent(
                  artist.name.toLowerCase().replace(/\s+/g, "-")
                )}`}
                key={artist._id}
                className="group"
                data-aos={`${
                  index === 0
                    ? "fade-right"
                    : index === 1
                    ? "flip-up"
                    : "fade-left"
                }`}
                data-aos-delay={150 + index * 100}
              >
                <div className="bg-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        artist.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          artist.name || "Artist"
                        )}&background=6366f1&color=fff&size=256`
                      }
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize text-lg group-hover:text-indigo-600 transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {artist.location || "Artist"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {artist.bio ||
                      "Talented artist showcasing their creative work."}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {artist.artworks?.length || 0}{" "}
                      {artist.artworks?.length === 1 ? "Artwork" : "Artworks"}
                    </span>
                    <span className="text-indigo-600 font-medium">
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist CTA */}
      <section
        className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white relative overflow-hidden"
        aria-label="Artist Call to Action"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Are You an Artist?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join our vibrant community of creators. Showcase your artwork,
            connect with enthusiasts, and grow your audience.
          </p>
          <a
            href="https://www.instagram.com/mo0o__7lli__/"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg shadow-lg text-indigo-900 bg-white hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Join as an artist"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Me
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
