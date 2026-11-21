import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { TREATMENTS_DATA, FAQS_DATA } from '../../../infrastructure/data/treatmentData.js';

export class TreatmentController extends BaseController {
  public getTreatments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : 'all';
      const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';

      let results = [...TREATMENTS_DATA];

      if (category && category !== 'all') {
        const categoryMap: Record<string, string[]> = {
          metabolic: ['metabolic-health', 'digestive-health'],
          women: ['womens-health'],
          joints: ['musculoskeletal-care'],
          mind: ['mental-wellbeing', 'neurological-health'],
          skin: ['skin-hair-health'],
          preventive: ['preventive-healthcare', 'geriatric-health', 'respiratory-health'],
        };
        const allowedIds = categoryMap[category] || [category];
        results = results.filter((item) => allowedIds.includes(item.id) || item.category === category);
      }

      if (search) {
        results = results.filter((item) => {
          const inTitle = item.title.toLowerCase().includes(search);
          const inDesc = item.description.toLowerCase().includes(search);
          const inTag = item.categoryTag.toLowerCase().includes(search);
          const inBenefits = item.benefits.some((b) => b.toLowerCase().includes(search));
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
