import { Router, type RequestHandler } from 'express';
import multer from 'multer';
import type { GalleryController } from '../../controllers/gallery/gallery.controller.js';
import validate from '../../../shared/middlewares/validate-request.js';
import { createGalleryItemSchema, queryGallerySchema } from '../../validators/gallery/gallery.schema.js';

export function buildGalleryRoutes(galleryController: GalleryController): Router {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
      if (allowedMimes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are accepted.'));
      }
    },
  });

  const uploadMiddleware: RequestHandler = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: 'Image file size must be less than 2MB',
          });
          return;
        }
        res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
        });
        return;
      }
      next();
    });
  };

  router.get('/images/*key', galleryController.getImage);
  router.get('/', validate(queryGallerySchema), galleryController.getGallery);
  router.post('/', uploadMiddleware, validate(createGalleryItemSchema), galleryController.createGalleryItem);
  router.delete('/:id', galleryController.deleteGalleryItem);
  router.post('/reset', galleryController.resetDefaults);

  return router;
}
