export interface CreateYogaSessionDTO {
  title: string;
  duration: string;
  format: string;
  suitableFor: string;
  days: string[];
  time?: string | null;
  scheduleItems?: { day: string; time: string }[] | null;
  description: string;
  level?: string | null;
  ageGroup?: string | null;
  instructor?: string | null;
  location?: string | null;
  capacity?: number | null;
  price?: string | null;
  priceAmount?: string | null;
  priceUnit?: string | null;
  status?: string | null;
  imageUrl?: string | null;
}

export interface UpdateYogaSessionDTO {
  title?: string;
  duration?: string;
  format?: string;
  suitableFor?: string;
  days?: string[];
  time?: string | null;
  scheduleItems?: { day: string; time: string }[] | null;
  description?: string;
  level?: string | null;
  ageGroup?: string | null;
  instructor?: string | null;
  location?: string | null;
  capacity?: number | null;
  price?: string | null;
  priceAmount?: string | null;
  priceUnit?: string | null;
  status?: string | null;
  imageUrl?: string | null;
}

export interface YogaSessionResponseDTO {
  id: string;
  title: string;
  duration: string;
  format: string;
  suitableFor: string;
  days: string[];
  time?: string | null;
  scheduleItems?: { day: string; time: string }[] | null;
  description: string;
  level?: string | null;
  ageGroup?: string | null;
  instructor?: string | null;
  location?: string | null;
  capacity?: number | null;
  enrolledCount: number;
  price?: string | null;
  priceAmount?: string | null;
  priceUnit?: string | null;
  status: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
