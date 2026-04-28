import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'alexa-tours',
          resource_type: 'image',
          transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result: UploadApiResponse) => {
          if (error) reject(new InternalServerErrorException('Error al subir imagen'));
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}
