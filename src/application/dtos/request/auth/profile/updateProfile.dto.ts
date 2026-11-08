export interface UpdateProfileRequestDto {
  userId: number;
  name?: string;
  email?: string;
  phone?: string | null;
}

export type UpdateProfileInputDto = UpdateProfileRequestDto;
