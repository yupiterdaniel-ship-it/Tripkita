export class CreatePackageDto {
  name: string;
  location: string;
  price: number;
  duration: string;
  description?: string;
  facilities?: string[];
  schedule?: string;
  image?: string;
  category?: string;
  maxCapacity?: number;
  availableSlots?: number;
}

export class UpdatePackageDto {
  name?: string;
  location?: string;
  price?: number;
  duration?: string;
  description?: string;
  facilities?: string[];
  schedule?: string;
  image?: string;
  category?: string;
  maxCapacity?: number;
  availableSlots?: number;
  isActive?: boolean;
}
