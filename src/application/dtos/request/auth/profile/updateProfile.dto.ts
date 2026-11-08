export interface UpdateProfileInputDto {
  userId: number;
  name?: string;
  email?: string;
  phone?: string | null;
}
