import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get all artists
export const getAllArtists = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/artists`);
    return response.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};

// Get artist by ID
export const getArtistById = async (id) => {
  try {
    if (!id) {
      throw new Error("Artist ID is required");
    }
    const response = await axios.get(`${API_URL}/api/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching artist with ID ${id}:`, error);
    throw error;
  }
};

// Get artist by name (finds in the list then gets details)
export const getArtistByName = async (name) => {
  try {
    if (!name) {
      throw new Error("Artist name is required");
    }

    const response = await axios.get(`${API_URL}/api/artists/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching artist by name ${name}:`, error);
    throw error;
  }
};

// Get artworks by artist ID
export const getArtworksByArtist = async (artistId) => {
  try {
    if (!artistId) {
      throw new Error("Artist ID is required");
    }
    const response = await axios.get(
      `${API_URL}/api/artworks?artist=${artistId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching artworks for artist ${artistId}:`, error);
    throw error;
  }
};
