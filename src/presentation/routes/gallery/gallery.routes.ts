import { Router } from 'express';
import multer from 'multer';
import type { GalleryController } from '../../controllers/gallery/gallery.controller.js';

export function buildGalleryRoutes(galleryController: GalleryController): Router {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  router.get('/images/*', galleryController.getImage);
  router.get('/', galleryController.getGallery);
  router.post('/', upload.single('file'), galleryController.createGalleryItem);
  router.delete('/:id', galleryController.deleteGalleryItem);
  router.post('/reset', galleryController.resetDefaults);

  return router;
}
