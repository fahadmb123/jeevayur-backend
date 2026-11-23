import { YogaSession, type DayScheduleItem } from '../../../domain/entities/yoga/yogaSession.entity.js';

export class YogaMapper {
  public static toDomain(raw: any): YogaSession {
    let parsedDays: string[] = [];
    if (typeof raw.days === 'string') {
      try {
        const parsed = JSON.parse(raw.days);
        if (Array.isArray(parsed)) parsedDays = parsed;
      } catch {
        parsedDays = [];
      }
    } else if (Array.isArray(raw.days)) {
      parsedDays = raw.days;
    }

    let parsedScheduleItems: DayScheduleItem[] | null = null;
    if (typeof raw.scheduleItems === 'string' && raw.scheduleItems.trim()) {
      try {
        const parsed = JSON.parse(raw.scheduleItems);
        if (Array.isArray(parsed)) parsedScheduleItems = parsed;
      } catch {
        parsedScheduleItems = null;
      }
    } else if (Array.isArray(raw.scheduleItems)) {
      parsedScheduleItems = raw.scheduleItems;
    }

    return new YogaSession({
      id: raw.id,
      title: raw.title,
      duration: raw.duration,
      format: raw.format,
      suitableFor: raw.suitableFor,
      days: parsedDays,
      time: raw.time,
      scheduleItems: parsedScheduleItems,
      description: raw.description,
      level: raw.level,
      ageGroup: raw.ageGroup,
      instructor: raw.instructor,
      location: raw.location,
      capacity: raw.capacity,
      enrolledCount: raw.enrolledCount,
      price: raw.price,
      priceAmount: raw.priceAmount,
      priceUnit: raw.priceUnit,
      status: raw.status,
      imageUrl: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(entity: YogaSession): any {
    return {
      id: entity.id,
      title: entity.title,
      duration: entity.duration,
      format: entity.format,
      suitableFor: entity.suitableFor,
      days: JSON.stringify(entity.days || []),
      time: entity.time || null,
      scheduleItems: entity.scheduleItems ? JSON.stringify(entity.scheduleItems) : null,
      description: entity.description,
      level: entity.level || null,
      ageGroup: entity.ageGroup || null,
      instructor: entity.instructor || null,
      location: entity.location || null,
      capacity: entity.capacity ?? null,
      enrolledCount: entity.enrolledCount ?? 0,
      price: entity.price || null,
      priceAmount: entity.priceAmount || null,
      priceUnit: entity.priceUnit || null,
      status: entity.status || 'active',
      imageUrl: entity.imageUrl || null,
    };
  }
}
