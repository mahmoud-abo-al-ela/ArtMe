import { useState, useEffect } from "react";
import axios from "axios";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get("https://artportfolio.com/api/artworks");
        setArtworks(res.data);
        setFilteredArtworks(res.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((artwork) => artwork.category)),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter state changes
    let results = [...artworks];

    if (filters.category) {
      results = results.filter(
        (artwork) => artwork.category === filters.category
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.artist.name.toLowerCase().includes(searchLower) ||
          (artwork.description &&
            artwork.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredArtworks(results);
  }, [filters, artworks]);

  const handleCategoryChange = (e) => {
    setFilters({
      ...filters,
      category: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Art Gallery</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Artworks
            </label>
            <input
              type="text"
              id="search"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, artist, or description"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.length > 0 ? (
          filteredArtworks.map((artwork) => (
            <div
              key={artwork._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {artwork.title}
                </h2>
                <p className="text-gray-600">by {artwork.artist.name}</p>
                <p className="text-gray-500 text-sm mt-2">{artwork.category}</p>
                {artwork.description && (
                  <p className="text-gray-700 mt-2 line-clamp-3">
                    {artwork.description}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No artworks found matching your filters. Try adjusting your search
            criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
