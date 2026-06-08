export class CreateBookingDto {
  packageId: string;
  customerId: string;
  travelDate: string;
  numberOfPeople: number;
  notes?: string;
}

export class UpdateBookingDto {
  travelDate?: string;
  numberOfPeople?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
}
