/// <reference types="multer" />
export declare class UploadController {
    uploadFile(file: Express.Multer.File): Promise<{
        filename: string;
        originalName: string;
    }>;
}
