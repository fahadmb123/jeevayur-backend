import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { FAQS_DATA } from '../../../infrastructure/data/treatmentData.js';
import { db } from '../../../shared/database/client.js';

export class TreatmentController extends BaseController {
  public getTreatments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';

      const galleryItems = await db.galleryItem.findMany({
        where: { category: 'treatment' },
        orderBy: { createdAt: 'desc' },
      });

      let results = galleryItems.map((item) => ({
        id: item.id,
        title: item.title,
        categoryTag: 'Clinical Treatment',
        description: item.description || 'Authentic clinical Ayurvedic formulation and therapy guided by Dr. Ahalya T.S.',
        icon: '🌿',
        image: item.imageUrl,
        benefits: [
          'Classical herbal and clinical formulation',
          'Personalized treatment methodology',
          'Root-cause holistic healing',
        ],
        duration: 'Personalized Care',
        category: 'all',
      }));

      if (search) {
        results = results.filter((item) => {
          const inTitle = item.title.toLowerCase().includes(search);
          const inDesc = item.description.toLowerCase().includes(search);
          const inTag = (item.categoryTag || '').toLowerCase().includes(search);
          const inBenefits = (item.benefits || []).some((b: string) => b.toLowerCase().includes(search));
          return inTitle || inDesc || inTag || inBenefits;
        });
      }

      this.sendSuccess(res, 'Treatments retrieved successfully', {
        treatments: results,
        total: results.length,
        faqs: FAQS_DATA,
      });
    } catch (err) {
      next(err);
    }
  };

  public getFaqs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.sendSuccess(res, 'FAQs retrieved successfully', {
        faqs: FAQS_DATA,
      });
    } catch (err) {
      next(err);
    }
  };
}
