import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';
import { YogaSession } from '../../../domain/entities/yoga/yogaSession.entity.js';
import type { UpdateYogaSessionDTO } from '../../dtos/yoga/yoga.dto.js';

export class UpdateYogaSessionUseCase {
  constructor(private readonly yogaRepository: IYogaRepository) {}

  public async execute(id: string, dto: UpdateYogaSessionDTO): Promise<YogaSession> {
    const existing = await this.yogaRepository.findById(id);
    if (!existing) {
      throw new Error(`Yoga session with ID ${id} not found.`);
    }

    const updated = new YogaSession({
      id: existing.id,
      title: dto.title !== undefined ? dto.title.trim() : existing.title,
      duration: dto.duration !== undefined ? dto.duration.trim() : existing.duration,
      format: dto.format !== undefined ? dto.format.trim().toLowerCase() : existing.format,
      suitableFor: dto.suitableFor !== undefined ? dto.suitableFor.trim() : existing.suitableFor,
      days: dto.days !== undefined ? dto.days : existing.days,
      time: dto.time !== undefined ? (dto.time?.trim() || null) : existing.time,
      scheduleItems: dto.scheduleItems !== undefined ? dto.scheduleItems : existing.scheduleItems,
      description: dto.description !== undefined ? dto.description.trim() : existing.description,
      level: dto.level !== undefined ? (dto.level?.trim() || null) : existing.level,
      ageGroup: dto.ageGroup !== undefined ? (dto.ageGroup?.trim() || null) : existing.ageGroup,
      instructor: dto.instructor !== undefined ? (dto.instructor?.trim() || null) : existing.instructor,
      location: dto.location !== undefined ? (dto.location?.trim() || null) : existing.location,
      capacity: dto.capacity !== undefined ? dto.capacity : existing.capacity,
      enrolledCount: existing.enrolledCount,
      price: dto.price !== undefined ? (dto.price?.trim() || null) : existing.price,
      priceAmount: dto.priceAmount !== undefined ? (dto.priceAmount?.trim() || null) : existing.priceAmount,
      priceUnit: dto.priceUnit !== undefined ? (dto.priceUnit?.trim() || null) : existing.priceUnit,
      status: (dto.status !== undefined && dto.status !== null) ? dto.status : existing.status,
      imageUrl: dto.imageUrl !== undefined ? (dto.imageUrl?.trim() || null) : existing.imageUrl,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.yogaRepository.update(updated);
  }
}
