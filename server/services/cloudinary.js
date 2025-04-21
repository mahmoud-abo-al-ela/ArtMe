const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Helper to upload image to Cloudinary
const uploadToCloudinary = (folder, buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = { uploadToCloudinary };
