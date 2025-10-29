import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export const getCloudinaryClient = () => {
  if (!configured) {
    // Support multiple env var conventions and CLOUDINARY_URL as a single source
    const cloudName = process.env.CLOUDINARY_API_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET ?? process.env.CLOUDINARY_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl) {
      // If CLOUDINARY_URL is present (e.g. cloudinary://key:secret@name), use it.
      cloudinary.config({ cloudinary_url: cloudinaryUrl });
      configured = true;
    } else {
      const missing: string[] = [];
      if (!cloudName) missing.push('CLOUDINARY_API_CLOUD_NAME or CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

      if (missing.length) {
        throw new Error(`Cloudinary environment variables are not fully configured. Missing: ${missing.join(', ')}`);
      }

      cloudinary.config({
        cloud_name: cloudName!,
        api_key: apiKey!,
        api_secret: apiSecret!
      });

      configured = true;
    }
  }

  return cloudinary;
};
