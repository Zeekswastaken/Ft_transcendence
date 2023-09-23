// multer-config.ts

import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: '../frontend/public/avatars/', // Specify the destination folder where files will be stored
    filename: (req, file, callback) => {
      // console.log("dir : ",__dirname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const newFileName = `avatar-${uniqueSuffix}${fileExtension}`;
      callback(null, newFileName);
    },
  }),
};
