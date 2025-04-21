import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { FiEye, FiTrash2 } from "react-icons/fi";

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await api.get("/artworks");
        setArtworks(response.data);
      } catch (err) {
        setError("Failed to fetch artworks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-light">
        Loading artworks...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-danger rounded-md">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-light">
        Artworks Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <div
              key={artwork._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-text text-lg mb-2">
                  {artwork.title}
                </h3>
                <p className="text-text-light text-sm mb-1">
                  By: {artwork.artist.name}
                </p>
                <p className="text-text font-medium mb-1">${artwork.price}</p>
                <p className="text-sm text-text-light mb-3">
                  Status:{" "}
                  <span className="text-green-600">
                    {artwork.status || "Active"}
                  </span>
                </p>
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-text-light text-sm transition-colors">
                    <FiEye className="mr-1" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-red-50 hover:bg-red-100 rounded text-danger text-sm transition-colors">
                    <FiTrash2 className="mr-1" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-light">
            No artworks found
          </div>
        )}
      </div>
    </div>
  );
};

export default Artworks;
