import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Property } from '../../lib/properties';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface BookingSuccessModalProps {
  visible: boolean;
  property: Property | null;
  bookingId: string;
  dates: { checkIn: Date; checkOut: Date };
  totalPrice: number;
  onClose: () => void;
  onViewBookings: () => void;
}

export default function BookingSuccessModal({
  visible,
  property,
  bookingId,
  dates,
  totalPrice,
  onClose,
  onViewBookings,
}: BookingSuccessModalProps) {
  const { theme } = useTheme();

  if (!property) return null;

  const nights = Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Success Icon */}
          <View style={[styles.successIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="checkmark" size={48} color={theme.colors.primary} />
          </View>

          {/* Success Message */}
          <Text variant="h2" style={styles.successTitle}>Booking Confirmed!</Text>
          <Text variant="body" color="secondary" style={styles.successText}>
            Your stay at {property.title} has been successfully booked.
          </Text>

          {/* Booking Details */}
          <View style={[styles.bookingCard, { backgroundColor: theme.colors.surface }]}>
            <Image
              source={{ uri: property.images[0] || 'https://via.placeholder.com/100' }}
              style={styles.propertyImage}
            />
            <View style={styles.bookingDetails}>
              <Text variant="body" style={styles.propertyName}>{property.title}</Text>
              <View style={styles.bookingInfo}>
                <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                <Text variant="caption" color="secondary">
                  {dates.checkIn.toLocaleDateString()} - {dates.checkOut.toLocaleDateString()} • {nights} nights
                </Text>
              </View>
              <Text variant="caption" color="secondary">Booking ID: {bookingId}</Text>
            </View>
          </View>

          {/* Next Steps */}
          <View style={styles.nextSteps}>
            <Text variant="h3" style={styles.nextStepsTitle}>What's Next?</Text>
            <View style={styles.steps}>
              <View style={styles.step}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
                <Text variant="body" color="secondary">You'll receive a confirmation email</Text>
              </View>
              <View style={styles.step}>
                <Ionicons name="key-outline" size={20} color={theme.colors.primary} />
                <Text variant="body" color="secondary">Check-in instructions will be sent 24 hours before arrival</Text>
              </View>
              <View style={styles.step}>
                <Ionicons name="heart-outline" size={20} color={theme.colors.primary} />
                <Text variant="body" color="secondary">Enjoy your stay!</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Button
            title="View My Bookings"
            onPress={onViewBookings}
            style={styles.viewBookingsButton}
          />
          <Button
            title="Continue Exploring"
            onPress={onClose}
            variant="outline"
            style={styles.continueButton}
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
    padding: 16,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  bookingCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  propertyName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  nextSteps: {
    width: '100%',
  },
  nextStepsTitle: {
    marginBottom: 16,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  viewBookingsButton: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
  },
});