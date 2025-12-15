import { v2 as cloudinary } from 'cloudinary';
export const deleteFile = async (filePublicId: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const match = filePublicId.match(/\/([^/]+)\.[a-z0-9]+$/i);
  await cloudinary.uploader.destroy(match[1]);
};
