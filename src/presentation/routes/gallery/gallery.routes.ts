import { Router } from 'express';
import multer from 'multer';
import type { GalleryController } from '../../controllers/gallery/gallery.controller.js';
import validate from '../../../shared/middlewares/validate-request.js';
import { createGalleryItemSchema, queryGallerySchema } from '../../validators/gallery/gallery.schema.js';

export function buildGalleryRoutes(galleryController: GalleryController): Router {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
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

  router.get('/images/*', galleryController.getImage);
  router.get('/', validate(queryGallerySchema), galleryController.getGallery);
  router.post('/', upload.single('file'), validate(createGalleryItemSchema), galleryController.createGalleryItem);
  router.delete('/:id', galleryController.deleteGalleryItem);
  router.post('/reset', galleryController.resetDefaults);

  return router;
}
