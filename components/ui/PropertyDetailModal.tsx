import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Property } from '../../lib/properties';
import { BookingDates } from '../../types/bookings';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';
import { Card } from './Card';
import { Ionicons } from '@expo/vector-icons';

interface PropertyDetailModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
  onBookNow: (property: Property, dates: BookingDates, guests: number) => void;
}

export default function PropertyDetailModal({
  visible,
  property,
  onClose,
  onBookNow,
}: PropertyDetailModalProps) {
  const { theme } = useTheme();
  const [dates, setDates] = useState<BookingDates>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(1);

  if (!property) return null;

  const calculateTotal = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const nights = Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return (property.pricing.perNight * nights) + property.pricing.cleaningFee;
  };

  const handleBookNow = () => {
    if (!dates.checkIn || !dates.checkOut) {
      Alert.alert('Select Dates', 'Please select check-in and check-out dates');
      return;
    }
    onBookNow(property, dates, guests);
  };

  const simulateDateSelection = () => {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 3);
    setDates({ checkIn, checkOut });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="h3">Property Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image
            source={{ uri: property.images[0] || 'https://via.placeholder.com/400' }}
            style={styles.image}
          />

          {/* Basic Info */}
          <View style={styles.section}>
            <Text variant="h2" style={styles.title}>{property.title}</Text>
            <View style={styles.location}>
              <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
              <Text variant="body" color="secondary">
                {property.location.city}, {property.location.country}
              </Text>
            </View>
            <View style={styles.propertyDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="bed-outline" size={20} color={theme.colors.primary} />
                <Text variant="body">{property.bedrooms} bedrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
                <Text variant="body">Sleeps {property.guests}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
                <Text variant="body">{property.bathrooms} bathrooms</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Description</Text>
            <Text variant="body" color="secondary">{property.description}</Text>
          </Card>

          {/* Amenities */}
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                  <Text variant="body">{amenity}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Booking Section */}
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Book Your Stay</Text>
            
            {/* Simulated Date Picker */}
            <TouchableOpacity 
              style={[styles.dateSelector, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={simulateDateSelection}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text variant="body">
                {dates.checkIn && dates.checkOut 
                  ? `${dates.checkIn.toLocaleDateString()} - ${dates.checkOut.toLocaleDateString()}`
                  : 'Select dates'
                }
              </Text>
            </TouchableOpacity>

            {/* Guest Selector */}
            <View style={styles.guestSelector}>
              <Text variant="body">Guests</Text>
              <View style={styles.guestControls}>
                <TouchableOpacity 
                  onPress={() => setGuests(prev => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                >
                  <Ionicons 
                    name="remove-circle" 
                    size={24} 
                    color={guests <= 1 ? theme.colors.border : theme.colors.primary} 
                  />
                </TouchableOpacity>
                <Text variant="h3" style={styles.guestCount}>{guests}</Text>
                <TouchableOpacity onPress={() => setGuests(prev => prev + 1)}>
                  <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Breakdown */}
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">
                  ${property.pricing.perNight} × {dates.checkIn && dates.checkOut ? Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0} nights
                </Text>
                <Text variant="body">
                  ${dates.checkIn && dates.checkOut ? property.pricing.perNight * Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">Cleaning fee</Text>
                <Text variant="body">${property.pricing.cleaningFee}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text variant="h3">Total</Text>
                <Text variant="h3">${calculateTotal()}</Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.footerPrice}>
            <Text variant="h3" style={{ color: theme.colors.primary }}>
              ${calculateTotal()}
            </Text>
            <Text variant="caption" color="secondary">total</Text>
          </View>
          <Button
            title="Book Now"
            onPress={handleBookNow}
            style={styles.bookButton}
            disabled={!dates.checkIn || !dates.checkOut}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  guestSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  guestControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  guestCount: {
    minWidth: 30,
    textAlign: 'center',
  },
  priceBreakdown: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  footerPrice: {
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
    marginLeft: 16,
  },
});