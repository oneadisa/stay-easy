// User types
export type UserDoc = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'guest' | 'host' | 'admin';
  createdAt: number;
  updatedAt: number;
};

// Property types
export type PropertyType = 'apartment' | 'house' | 'villa' | 'cabin' | 'other';

export type Location = {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  location: Location;
  pricePerNight: number;
  rating?: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  hostId: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
};

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: number;
  checkOut: number;
  nights: number;
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  createdAt: number;
  updatedAt: number;
};

// Review types
export type Review = {
  id: string;
  propertyId: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: number;
};

// Filter types
export type FilterParams = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  minGuests?: number;
};

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PropertyDetails: { propertyId: string };
  BookingDetails: { bookingId: string };
  EditProfile: undefined;
  AddProperty: undefined;
  Search: undefined;
};

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
  Host: undefined;
};
