import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.TOKEN_CLOUDINARY_SECRET_KEY as string,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'clinic',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    } as any 
  });

const uploadCloud = multer({ storage });

export default uploadCloud;
