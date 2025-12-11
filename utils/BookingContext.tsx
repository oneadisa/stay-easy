import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/bookings';
import { useAuthUser } from '../state/authStore';

interface BookingContextType {
  bookings: Booking[];
  allBookings: Booking[]; // All bookings (for host to see bookings on their properties)
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const BOOKINGS_KEY = 'user_bookings';

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuthUser();
  const [bookings, setBookings] = useState<Booking[]>([]); // User's bookings (as guest)
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // All bookings (for hosts)

  // Load bookings from AsyncStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_KEY);
      
      if (!bookingsJson) {
        setBookings([]);
        return;
      }
      
      const allBookingsData: Booking[] = JSON.parse(bookingsJson);
      
      // Store all bookings (for hosts to see bookings on their properties)
      setAllBookings(allBookingsData);
      
      // Filter bookings for current user (bookings they made as guests)
      const userBookings = allBookingsData.filter(booking => booking.userId === user.uid);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const saveBookings = async (bookingsToSave: Booking[]) => {
    if (!user) return;
    
    try {
      // Get all bookings from storage
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_KEY);
      const allBookingsData: Booking[] = bookingsJson ? JSON.parse(bookingsJson) : [];
      
      // Remove old bookings for this user and add new ones
      const otherUsersBookings = allBookingsData.filter(b => b.userId !== user.uid);
      const updatedBookings = [...otherUsersBookings, ...bookingsToSave];
      
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
      
      // Update allBookings state
      setAllBookings(updatedBookings);
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
  };

  const cancelBooking = async (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    );
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
  };

  const refreshBookings = async () => {
    await loadBookings();
  };

  return (
    <BookingContext.Provider value={{ bookings, allBookings, addBooking, cancelBooking, refreshBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
