export interface PatientResponseDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
  condition: string | null;
  status: string;
  lastVisit: string | null;
  source: 'website' | 'doctor';
  createdAt: string;
}

export interface PatientCountsDto {
  all: number;
  completed: number;
  uncompleted: number;
}

export interface GetPatientsResponseDto {
  patients: PatientResponseDto[];
  total: number;
  counts?: PatientCountsDto;
  page?: number;
  limit?: number;
}

