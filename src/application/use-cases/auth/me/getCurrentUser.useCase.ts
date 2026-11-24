import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { UserResponseDto } from '../../../dtos/response/auth/user/user.dto.js';
import { UserMapper } from '../../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';

export interface GetCurrentUserInput {
  userId: number;
}

export class GetCurrentUserUseCase implements IUseCase<GetCurrentUserInput, UserResponseDto> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetCurrentUserInput): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new ApplicationError('USER_NOT_FOUND', 'User not found', 'NOT_FOUND');
    }

    return UserMapper.toDto(user);
  }
}
