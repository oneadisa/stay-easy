import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Property } from '../../lib/properties';
import { BookingDates } from '../../types/bookings';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';
import { Card } from './Card';
import { X, MapPin, Bed, Users, Droplets, Check, Calendar, Plus, Minus } from 'lucide-react-native';
import { formatPrice } from '../../utils/price';

interface PropertyDetailModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
  onBookNow: (property: Property, dates: BookingDates, guests: number) => void;
}

const { width } = Dimensions.get('window');

export default function PropertyDetailModal({
  visible,
  property,
  onClose,
  onBookNow,
}: PropertyDetailModalProps) {
  const { theme } = useTheme();
  const [dates, setDates] = useState<BookingDates>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const imageScrollRef = useRef<FlatList>(null);

  if (!property) return null;

  // Filter out empty/invalid images and ensure we have at least one valid image
  const validImages = property.images?.filter(img => img && img.trim().length > 0) || [];
  const defaultImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';
  const images = validImages.length > 0 ? validImages : [defaultImage];

  const calculateTotal = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const nights = Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return (property.pricing.perNight * nights) + property.pricing.cleaningFee;
  };

  const getNights = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    return Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleCheckInChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCheckInPicker(false);
    }
    if (selectedDate) {
      // Reset check-out if it's before the new check-in date
      const newCheckIn = selectedDate;
      setDates(prev => ({
        checkIn: newCheckIn,
        checkOut: prev.checkOut && prev.checkOut <= newCheckIn ? null : prev.checkOut,
      }));
      // On iOS, keep picker open - user clicks Done to close
      if (Platform.OS === 'ios') {
        // Picker stays open
      }
    }
  };

  const handleCheckOutChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCheckOutPicker(false);
    }
    if (selectedDate && dates.checkIn && selectedDate > dates.checkIn) {
      setDates(prev => ({ ...prev, checkOut: selectedDate }));
      // On iOS, keep picker open - user clicks Done to close
      if (Platform.OS === 'ios') {
        // Picker stays open
      }
    } else if (selectedDate && dates.checkIn) {
      Alert.alert('Invalid Date', 'Check-out date must be after check-in date');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const handleBookNow = () => {
    if (!dates.checkIn || !dates.checkOut) {
      Alert.alert('Select Dates', 'Please select check-in and check-out dates');
      return;
    }
    if (guests > property.guests) {
      Alert.alert('Too Many Guests', `This property can accommodate up to ${property.guests} guests. Please reduce the number of guests.`);
      return;
    }
    onBookNow(property, dates, guests);
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
            <X size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="title">Property Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={imageScrollRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `image-${index}`}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              renderItem={({ item }) => {
                const imageUri = item && item.trim().length > 0 ? item : defaultImage;
                
                return (
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={() => {
                        // Image will fallback to defaultImage if error occurs
                        console.log('Image failed to load:', imageUri);
                      }}
                    />
                  </View>
                );
              }}
            />
            {/* Image Indicators */}
            {images.length > 1 && (
              <View style={styles.imageIndicators}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      {
                        backgroundColor: index === currentImageIndex 
                          ? theme.colors.primary 
                          : 'rgba(255, 255, 255, 0.5)',
                      },
                    ]}
                  />
                ))}
              </View>
            )}
            {/* Image Counter */}
            {images.length > 1 && (
              <View style={styles.imageCounter}>
                <Text variant="caption" style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </View>
            )}
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text variant="heading" style={styles.title}>{property.title}</Text>
            <View style={styles.location}>
              <MapPin size={16} color={theme.colors.textSecondary} />
              <Text variant="body" color="secondary">
                {property.location.city}, {property.location.country}
              </Text>
            </View>
            <View style={styles.propertyDetails}>
              <View style={styles.detailItem}>
                <Bed size={20} color={theme.colors.primary} />
                <Text variant="body">{property.bedrooms} bedrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Users size={20} color={theme.colors.primary} />
                <Text variant="body">Sleeps {property.guests}</Text>
              </View>
              <View style={styles.detailItem}>
                <Droplets size={20} color={theme.colors.primary} />
                <Text variant="body">{property.bathrooms} bathrooms</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Description</Text>
            <Text variant="body" color="secondary">{property.description}</Text>
          </Card>

          {/* Amenities */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Check size={16} color={theme.colors.primary} />
                  <Text variant="body">{amenity}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Booking Section */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Book Your Stay</Text>
            
            {/* Date Pickers */}
            <View style={styles.datePickersContainer}>
              {/* Check-in Date */}
              <View style={styles.datePickerWrapper}>
                <Text variant="caption" color="secondary" style={styles.dateLabel}>
                  Check-in
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.dateSelector, 
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: dates.checkIn ? theme.colors.primary : theme.colors.border,
                      borderWidth: dates.checkIn ? 2 : 1,
                    }
                  ]}
                  onPress={() => setShowCheckInPicker(true)}
                >
                  <Calendar size={20} color={theme.colors.primary} />
                  <Text variant="body" style={styles.dateText}>
                    {dates.checkIn ? formatDate(dates.checkIn) : 'Select check-in'}
                  </Text>
                </TouchableOpacity>
                {showCheckInPicker && Platform.OS === 'ios' && (
                  <View style={[styles.iosPickerContainer, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.iosPickerHeader, { borderBottomColor: theme.colors.border }]}>
                      <TouchableOpacity onPress={() => setShowCheckInPicker(false)}>
                        <Text variant="body" style={{ color: theme.colors.primary }}>Cancel</Text>
                      </TouchableOpacity>
                      <Text variant="title">Select Check-in</Text>
                      <TouchableOpacity onPress={() => setShowCheckInPicker(false)}>
                        <Text variant="body" style={{ color: theme.colors.primary }}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={dates.checkIn || new Date()}
                      mode="date"
                      display="spinner"
                      onChange={handleCheckInChange}
                      minimumDate={new Date()}
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {showCheckInPicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={dates.checkIn || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleCheckInChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              {/* Check-out Date */}
              <View style={styles.datePickerWrapper}>
                <Text variant="caption" color="secondary" style={styles.dateLabel}>
                  Check-out
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.dateSelector, 
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: dates.checkOut ? theme.colors.primary : theme.colors.border,
                      borderWidth: dates.checkOut ? 2 : 1,
                      opacity: !dates.checkIn ? 0.5 : 1,
                    }
                  ]}
                  onPress={() => {
                    if (dates.checkIn) {
                      setShowCheckOutPicker(true);
                    } else {
                      Alert.alert('Select Check-in', 'Please select check-in date first');
                    }
                  }}
                  disabled={!dates.checkIn}
                >
                  <Calendar size={20} color={theme.colors.primary} />
                  <Text variant="body" style={styles.dateText}>
                    {dates.checkOut ? formatDate(dates.checkOut) : 'Select check-out'}
                  </Text>
                </TouchableOpacity>
                {showCheckOutPicker && Platform.OS === 'ios' && (
                  <View style={[styles.iosPickerContainer, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.iosPickerHeader, { borderBottomColor: theme.colors.border }]}>
                      <TouchableOpacity onPress={() => setShowCheckOutPicker(false)}>
                        <Text variant="body" style={{ color: theme.colors.primary }}>Cancel</Text>
                      </TouchableOpacity>
                      <Text variant="title">Select Check-out</Text>
                      <TouchableOpacity onPress={() => setShowCheckOutPicker(false)}>
                        <Text variant="body" style={{ color: theme.colors.primary }}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={dates.checkOut || (dates.checkIn ? new Date(dates.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date())}
                      mode="date"
                      display="spinner"
                      onChange={handleCheckOutChange}
                      minimumDate={dates.checkIn ? new Date(dates.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {showCheckOutPicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={dates.checkOut || (dates.checkIn ? new Date(dates.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date())}
                    mode="date"
                    display="default"
                    onChange={handleCheckOutChange}
                    minimumDate={dates.checkIn ? new Date(dates.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                  />
                )}
              </View>
            </View>

            {/* Guest Selector */}
            <View style={styles.guestSelector}>
              <Text variant="body">Guests</Text>
              <View style={styles.guestControls}>
                <TouchableOpacity
                  onPress={() => setGuests(prev => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                  style={[styles.guestButton, { borderColor: guests <= 1 ? theme.colors.border : theme.colors.primary }]}
                >
                  <Minus size={20} color={guests <= 1 ? theme.colors.border : theme.colors.primary} />
                </TouchableOpacity>
                <Text variant="title" style={styles.guestCount}>{guests}</Text>
                <Text variant="caption" color="secondary" style={{ marginHorizontal: 8 }}>
                  / {property.guests} max
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (guests < property.guests) {
                      setGuests(prev => prev + 1);
                    } else {
                      Alert.alert('Guest Limit', `This property can accommodate up to ${property.guests} guests.`);
                    }
                  }}
                  disabled={guests >= property.guests}
                  style={[
                    styles.guestButton, 
                    { 
                      borderColor: guests >= property.guests ? theme.colors.border : theme.colors.primary,
                      opacity: guests >= property.guests ? 0.5 : 1,
                    }
                  ]}
                  activeOpacity={guests >= property.guests ? 1 : 0.7}
                >
                  <Plus size={20} color={guests >= property.guests ? theme.colors.border : theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Breakdown */}
            {dates.checkIn && dates.checkOut && (
              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text variant="body" color="secondary">
                    {formatPrice(property.pricing.perNight)} × {getNights()} {getNights() === 1 ? 'night' : 'nights'}
                  </Text>
                  <Text variant="body">
                    {formatPrice(property.pricing.perNight * getNights())}
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text variant="body" color="secondary">Cleaning fee</Text>
                  <Text variant="body">{formatPrice(property.pricing.cleaningFee)}</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text variant="title">Total</Text>
                  <Text variant="title">{formatPrice(calculateTotal())}</Text>
                </View>
              </View>
            )}
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.footerPrice}>
            <Text variant="title" style={{ color: theme.colors.primary }}>
              {dates.checkIn && dates.checkOut ? formatPrice(calculateTotal()) : 'Select dates'}
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  imageWrapper: {
    width: width,
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  datePickersContainer: {
    gap: 12,
    marginBottom: 16,
  },
  datePickerWrapper: {
    marginBottom: 12,
  },
  dateLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  dateText: {
    flex: 1,
  },
  iosPickerContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iosPicker: {
    height: 200,
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
  guestButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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