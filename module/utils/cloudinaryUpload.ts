import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../config/cloudinary';

export const CLOUDINARY_DEFAULT_FOLDER = 'safus-restaurant';

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folderName: string = CLOUDINARY_DEFAULT_FOLDER,
  publicId?: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        public_id: publicId,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
