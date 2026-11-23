export interface DayScheduleItem {
  day: string;
  time: string;
}

export interface YogaSessionProps {
  id: string;
  title: string;
  duration: string;
  format: string;
  suitableFor: string;
  days: string[];
  time?: string | null;
  scheduleItems?: DayScheduleItem[] | null;
  description: string;
  level?: string | null;
  ageGroup?: string | null;
  instructor?: string | null;
  location?: string | null;
  capacity?: number | null;
  enrolledCount?: number;
  price?: string | null;
  priceAmount?: string | null;
  priceUnit?: string | null;
  status?: string;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class YogaSession {
  public readonly id: string;
  public readonly title: string;
  public readonly duration: string;
  public readonly format: string;
  public readonly suitableFor: string;
  public readonly days: string[];
  public readonly time?: string | null;
  public readonly scheduleItems?: DayScheduleItem[] | null;
  public readonly description: string;
  public readonly level?: string | null;
  public readonly ageGroup?: string | null;
  public readonly instructor?: string | null;
  public readonly location?: string | null;
  public readonly capacity?: number | null;
  public readonly enrolledCount: number;
  public readonly price?: string | null;
  public readonly priceAmount?: string | null;
  public readonly priceUnit?: string | null;
  public readonly status: string;
  public readonly imageUrl?: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: YogaSessionProps) {
    this.id = props.id;
    this.title = props.title;
    this.duration = props.duration || '60 mins';
    this.format = props.format || 'offline';
    this.suitableFor = props.suitableFor || 'Beginner (All Ages)';
    this.days = props.days || [];
    this.time = props.time || null;
    this.scheduleItems = props.scheduleItems || null;
    this.description = props.description;
    this.level = props.level || 'Beginner';
    this.ageGroup = props.ageGroup || null;
    this.instructor = props.instructor || null;
    this.location = props.location || null;
    this.capacity = props.capacity ?? null;
    this.enrolledCount = props.enrolledCount ?? 0;
    this.price = props.price || null;
    this.priceAmount = props.priceAmount || null;
    this.priceUnit = props.priceUnit || null;
    this.status = props.status || 'active';
    this.imageUrl = props.imageUrl || null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
