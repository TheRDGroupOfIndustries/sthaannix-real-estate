import cloudinary from "./cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadFile = async (fileBuffer: Buffer, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    uploadStream.end(fileBuffer);
  });
};
