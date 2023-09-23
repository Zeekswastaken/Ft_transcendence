import { diskStorage } from 'multer';
import { extname } from 'path';

// Define the storage configuration for multer
export const multerConfig = {
  storage: diskStorage({
    destination: '../uploads', // Destination folder where files will be stored
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, 'orbiay' + '-' + uniqueSuffix + extname(file.originalname));
    },
  }),
};
