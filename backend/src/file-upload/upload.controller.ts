
// import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Response } from 'express';
// import * as multer from 'multer';
// import * as path from 'path';

// @Controller('upload')
// export class UploadController {
//   // Serve the HTML file for testing file uploads
//   @Get()
//   async render(@Res() res: Response) {
//     res.sendFile('/nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/index.html');
//   }

//   // Handle file upload using Multer
//   @Post('image')
//   async uploadImage(@Req() req, @Res() res: Response) {
//     try {
//       const file = req.files['image']; // Assuming the file input name is "image"

//       if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       // Specify the destination directory and file name
//       const destinationDirectory = './src/uploads'; // Adjust the path as needed
//       const filename = Date.now() + '-' + file.name;
//       const filePath = path.join(destinationDirectory, filename);

//       // Save the uploaded file
//       // fs.writeFileSync(filePath, file.data);

//       return res.status(200).json({ message: 'Image uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return res.status(500).json({ message: 'Error uploading image', error: error.message });
//     }
//   }
// }

// res.sendFile('/nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/index.html')
