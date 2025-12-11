import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../components/ThemeProvider';
import { Calendar, Search, Key, Compass, Users, Star } from 'lucide-react-native';
import { useAuthUser } from '../state/authStore';
import { useBookings } from '../utils/BookingContext';

export default function BookingsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuthUser();
  const { bookings, cancelBooking, refreshBookings } = useBookings();

  React.useEffect(() => {
    // Refresh bookings when screen mounts or user changes
    if (user) {
      refreshBookings();
    }
  }, [user, refreshBookings]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'confirmed');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');

  const handleCancelBooking = (bookingId: string, propertyTitle: string) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${propertyTitle}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: () => cancelBooking(bookingId),
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'completed':
        return '#6B7280'; 
      case 'cancelled':
        return '#EF4444'; 
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (bookings.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={[styles.illustrationContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <Calendar size={80} color={theme.colors.primary} />
          </View>
          
          <Text variant="heading" style={styles.emptyTitle}>
            No bookings yet
          </Text>
          
          <Text variant="body" color="secondary" style={styles.emptyDescription}>
            When you book a property, your upcoming and past bookings will appear here
          </Text>
          
          {/* Features */}
          <Card style={{ ...styles.featuresCard, backgroundColor: theme.colors.surface }}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Search size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text variant="body" style={styles.featureTitle}>Find your perfect stay</Text>
                <Text variant="caption" color="secondary">Browse properties that match your style</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Calendar size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text variant="body" style={styles.featureTitle}>Book with confidence</Text>
                <Text variant="caption" color="secondary">Easy booking process with instant confirmation</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Key size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text variant="body" style={styles.featureTitle}>Manage your trips</Text>
                <Text variant="caption" color="secondary">View and manage all your bookings in one place</Text>
              </View>
            </View>
          </Card>
          
          {/* CTA Button */}
          <Button
            title="Explore Properties"
            onPress={() => navigation.navigate('Home')}
            style={styles.ctaButton}
            leftIcon={<Compass size={20} color="#FFFFFF" />}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        <Text variant="heading" style={styles.title}>
          My Bookings
        </Text>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <View style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Upcoming</Text>
            {upcomingBookings.map(booking => (
              <Card key={booking.id} style={styles.bookingCard}>
                <Image
                  source={{ uri: booking.property.images[0] }}
                  style={styles.bookingImage}
                />
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingHeader}>
                    <Text variant="body" style={styles.bookingTitle}>
                      {booking.property.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text variant="caption" style={styles.statusText}>{getStatusText(booking.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingInfo}>
                    <View style={styles.infoItem}>
                      <Calendar size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Users size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingFooter}>
                    <Text variant="title" style={{ color: theme.colors.primary }}>
                      ₦{booking.totalPrice.toLocaleString()}
                    </Text>
                    <TouchableOpacity 
                      style={[styles.cancelButton, { borderColor: theme.colors.border }]}
                      onPress={() => handleCancelBooking(booking.id, booking.property.title)}
                    >
                      <Text variant="caption" style={{ color: theme.colors.error }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <View style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Past Stays</Text>
            {pastBookings.map(booking => (
              <Card key={booking.id} style={styles.bookingCard}>
                <Image
                  source={{ uri: booking.property.images[0] }}
                  style={styles.bookingImage}
                />
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingHeader}>
                    <Text variant="body" style={styles.bookingTitle}>
                      {booking.property.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text variant="caption" style={styles.statusText}>{getStatusText(booking.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingInfo}>
                    <View style={styles.infoItem}>
                      <Calendar size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Users size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
                      <Text variant="caption" style={{ color: theme.colors.warning }}>
                        Leave a review
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingFooter}>
                    <Text variant="title" style={{ color: theme.colors.primary }}>
                      ₦{booking.totalPrice.toLocaleString()}
                    </Text>
                    <Text variant="caption" color="secondary">Completed</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <View style={styles.section}>
            <Text variant="title" style={styles.sectionTitle}>Cancelled</Text>
            {cancelledBookings.map(booking => (
              <Card key={booking.id} style={styles.bookingCard}>
                <Image
                  source={{ uri: booking.property.images[0] }}
                  style={styles.bookingImage}
                />
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingHeader}>
                    <Text variant="body" style={styles.bookingTitle}>
                      {booking.property.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text variant="caption" style={styles.statusText}>{getStatusText(booking.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingInfo}>
                    <View style={styles.infoItem}>
                      <Calendar size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Users size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingFooter}>
                    <Text variant="title" style={{ color: theme.colors.error }}>
                      ₦{booking.totalPrice.toLocaleString()}
                    </Text>
                    <Text variant="caption" color="secondary">Refund processed</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  bookingCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bookingImage: {
    width: 100,
    height: 100,
  },
  bookingDetails: {
    flex: 1,
    padding: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingTitle: {
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInfo: {
    gap: 6,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresCard: {
    width: '100%',
    padding: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  ctaButton: {
    width: '100%',
  },
});