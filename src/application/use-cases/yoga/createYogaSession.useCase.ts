import crypto from 'crypto';
import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';
import { YogaSession } from '../../../domain/entities/yoga/yogaSession.entity.js';
import type { CreateYogaSessionDTO } from '../../dtos/yoga/yoga.dto.js';

export class CreateYogaSessionUseCase {
  constructor(private readonly yogaRepository: IYogaRepository) {}

  public async execute(dto: CreateYogaSessionDTO): Promise<YogaSession> {
    const session = new YogaSession({
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      duration: dto.duration.trim(),
      format: dto.format.trim().toLowerCase(),
      suitableFor: dto.suitableFor.trim(),
      days: dto.days,
      time: dto.time?.trim() || null,
      scheduleItems: dto.scheduleItems || null,
      description: dto.description.trim(),
      level: dto.level?.trim() || 'Beginner',
      ageGroup: dto.ageGroup?.trim() || null,
      instructor: dto.instructor?.trim() || null,
      location: dto.location?.trim() || null,
      capacity: dto.capacity ?? null,
      enrolledCount: 0,
      price: dto.price?.trim() || null,
      priceAmount: dto.priceAmount?.trim() || null,
      priceUnit: dto.priceUnit?.trim() || null,
      status: dto.status?.trim() || 'active',
      imageUrl: dto.imageUrl?.trim() || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.yogaRepository.create(session);
  }
}
