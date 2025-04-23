import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get all artists
export const getAllArtists = async () => {
  try {
    const response = await axios.get(`${API_URL}/artists`);
    return response.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};

// Get artist by name
export const getArtistByName = async (name) => {
  try {
    if (!name) {
      throw new Error("Artist name is required");
    }

    // URL encode the name parameter to handle special characters
    const encodedName = encodeURIComponent(name);
    const response = await axios.get(
      `${API_URL}/artists/profile/public?name=${encodedName}`
    );

    // Map server response to expected client format
    const artistData = response.data;

    // Ensure social links are properly structured
    const socialLinks = {
      instagram: artistData.socialLinks?.instagram || "",
      facebook: artistData.socialLinks?.facebook || "",
    };

    return {
      ...artistData,
      socialLinks: socialLinks,
      // Ensure artworks array is always defined
      artworks: artistData.artworks || [],
    };
  } catch (error) {
    console.error(`Error fetching artist with name ${name}:`, error);
    throw error;
  }
};

// Get artworks by artist ID
export const getArtworksByArtist = async (artistId) => {
  try {
    if (!artistId) {
      throw new Error("Artist ID is required");
    }
    const response = await axios.get(`${API_URL}/artworks?artist=${artistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching artworks for artist ${artistId}:`, error);
    throw error;
  }
};
