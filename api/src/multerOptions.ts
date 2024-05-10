import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const disk = {
  storage: diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
      try {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(
            'Invalid file type. Only images are allowed.',
          );
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          throw new BadRequestException('Size limit exceeded.');
        }

        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),
};
