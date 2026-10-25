import { BaseRepository } from '../../../shared/repositories/BaseRepository.js';
import prisma from '../prisma.js';
import { PrismaUserMapper } from '../mappers/PrismaUserMapper.js';
export class PrismaUserRepository extends BaseRepository {
    async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? PrismaUserMapper.toDomain(user) : null;
    }
    async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        return PrismaUserMapper.toDomain(user);
    }
}
