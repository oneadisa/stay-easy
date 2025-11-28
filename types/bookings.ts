export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  property: {
    title: string;
    images: string[];
    location: {
      city: string;
      country: string;
    };
    pricing: {
      perNight: number;
      cleaningFee: number;
    };
  };
}

export interface BookingDates {
  checkIn: Date | null;
  checkOut: Date | null;
}