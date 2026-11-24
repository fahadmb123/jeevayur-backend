export interface TreatmentItemDto {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  icon: string;
  image: string;
  benefits: string[];
  duration: string;
  category: string;
}

export interface FaqDto {
  q: string;
  a: string;
}

export interface TreatmentsResponseDto {
  treatments: TreatmentItemDto[];
  total: number;
  faqs: FaqDto[];
}
