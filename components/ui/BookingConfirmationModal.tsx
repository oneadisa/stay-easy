import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Property } from '../../lib/properties';
import { BookingDates } from '../../types/bookings';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowLeft, X, Calendar, Users, CheckCircle } from 'lucide-react-native';

interface BookingConfirmationModalProps {
  visible: boolean;
  property: Property | null;
  dates: BookingDates;
  guests: number;
  totalPrice: number;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function BookingConfirmationModal({
  visible,
  property,
  dates,
  guests,
  totalPrice,
  onClose,
  onConfirm,
  onBack,
}: BookingConfirmationModalProps) {
  const { theme } = useTheme();

  if (!property || !dates.checkIn || !dates.checkOut) return null;

  const nights = Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const handleConfirm = () => {
    onConfirm();
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
          <TouchableOpacity onPress={onBack}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="title">Confirm Booking</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Property Summary */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Your Stay</Text>
            <View style={styles.propertySummary}>
              <Text variant="body" style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.dates}>
                <Calendar size={16} color={theme.colors.textSecondary} />
                <Text variant="body" color="secondary">
                  {dates.checkIn.toLocaleDateString()} - {dates.checkOut.toLocaleDateString()} ({nights} nights)
                </Text>
              </View>
              <View style={styles.guests}>
                <Users size={16} color={theme.colors.textSecondary} />
                <Text variant="body" color="secondary">{guests} {guests === 1 ? 'guest' : 'guests'}</Text>
              </View>
            </View>
          </Card>

          {/* Price Breakdown */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceDetails}>
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">
                  {`₦${property.pricing.perNight.toLocaleString()} × ${nights} nights`}
                </Text>
                <Text variant="body">{`₦${(property.pricing.perNight * nights).toLocaleString()}`}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">Cleaning fee</Text>
                <Text variant="body">{`₦${property.pricing.cleaningFee.toLocaleString()}`}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">Service fee</Text>
                <Text variant="body">{`₦${Math.round(totalPrice * 0.1).toLocaleString()}`}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text variant="title">Total</Text>
                <Text variant="title">{`₦${(totalPrice + Math.round(totalPrice * 0.1)).toLocaleString()}`}</Text>
              </View>
            </View>
          </Card>

          {/* Cancellation Policy */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Cancellation Policy</Text>
            <Text variant="body" color="secondary">
              Free cancellation within 48 hours of booking. After that, cancel up to 7 days before check-in for a partial refund.
            </Text>
          </Card>

          {/* House Rules */}
          <Card style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>House Rules</Text>
            <View style={styles.rules}>
              <View style={styles.ruleItem}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <Text variant="body">No smoking</Text>
              </View>
              <View style={styles.ruleItem}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <Text variant="body">No pets</Text>
              </View>
              <View style={styles.ruleItem}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <Text variant="body">No parties or events</Text>
              </View>
              <View style={styles.ruleItem}>
                <CheckCircle size={16} color={theme.colors.primary} />
                <Text variant="body">Check-in: 3:00 PM - 10:00 PM</Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.footerPrice}>
            <Text variant="title" style={{ color: theme.colors.primary }}>
              {`$${totalPrice + Math.round(totalPrice * 0.1)}`}
            </Text>
            <Text variant="caption" color="secondary">total</Text>
          </View>
          <Button
            title="Confirm Booking"
            onPress={handleConfirm}
            style={styles.confirmButton}
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
  section: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  propertySummary: {
    gap: 8,
  },
  propertyTitle: {
    fontWeight: '600',
  },
  dates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guests: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceDetails: {
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
  rules: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  confirmButton: {
    flex: 1,
    marginLeft: 16,
  },
});