import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { ImageCarousel } from '../components/ImageCarousel';
import { MapPreview } from '../components/MapPreview';
import { useTheme } from '../components/ThemeProvider';
import { Property, RootStackParamList } from '../types';
import { fetchPropertyById } from '../lib/firestore';
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Home,
  Wifi,
  Car,
  Wind,
  Tv,
  UtensilsCrossed,
} from 'lucide-react-native';

type PropertyDetailsRouteProp = RouteProp<RootStackParamList, 'PropertyDetails'>;
type PropertyDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PropertyDetails'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Amenity icon mapping
const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Parking: Car,
  'Air Conditioning': Wind,
  TV: Tv,
  Kitchen: UtensilsCrossed,
  Pool: Home,
  Gym: Home,
  Garden: Home,
  Terrace: Home,
  Fireplace: Home,
};

export default function PropertyDetailsScreen() {
  const { theme } = useTheme();
  const route = useRoute<PropertyDetailsRouteProp>();
  const navigation = useNavigation<PropertyDetailsNavigationProp>();
  const { propertyId } = route.params;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPropertyById(propertyId);
      
      if (data) {
        setProperty(data);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // TODO: Navigate to booking screen
    console.log('Book now pressed for property:', propertyId);
    // navigation.navigate('BookingDetails', { propertyId });
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const getAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity];
    return IconComponent || Home;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="h3" style={styles.errorTitle}>
          {error || 'Property not found'}
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={property.images} height={300} />

        {/* Property Info */}
        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.headerSection}>
            <Text variant="h2" style={styles.title}>
              {property.title}
            </Text>
            <View style={styles.typeBadge}>
              <Text variant="caption" style={styles.typeText}>
                {property.propertyType.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Rating and Reviews */}
          {property.rating && (
            <View style={styles.ratingContainer}>
              <Star size={18} color="#FFD700" fill="#FFD700" />
              <Text variant="body" style={styles.ratingText}>
                {property.rating.toFixed(1)}
              </Text>
              <Text variant="body" color="secondary">
                ({property.reviewCount} reviews)
              </Text>
            </View>
          )}

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin size={18} color={theme.colors.textSecondary} />
            <Text variant="body" color="secondary" style={styles.locationText}>
              {property.location.address}, {property.location.city}, {property.location.country}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={24} color={theme.colors.primary} />
              <Text variant="body" style={styles.statValue}>
                {property.maxGuests}
              </Text>
              <Text variant="caption" color="secondary">
                Guests
              </Text>
            </View>
            <View style={styles.statItem}>
              <Bed size={24} color={theme.colors.primary} />
              <Text variant="body" style={styles.statValue}>
                {property.bedrooms}
              </Text>
              <Text variant="caption" color="secondary">
                Bedrooms
              </Text>
            </View>
            <View style={styles.statItem}>
              <Bath size={24} color={theme.colors.primary} />
              <Text variant="body" style={styles.statValue}>
                {property.bathrooms}
              </Text>
              <Text variant="caption" color="secondary">
                Bathrooms
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Description */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              About this place
            </Text>
            <Text variant="body" color="secondary" style={styles.description}>
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.section}>
                <Text variant="h3" style={styles.sectionTitle}>
                  Amenities
                </Text>
                <View style={styles.amenitiesGrid}>
                  {property.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <View key={index} style={styles.amenityItem}>
                        <Icon size={20} color={theme.colors.textPrimary} />
                        <Text variant="body" style={styles.amenityText}>
                          {amenity}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* Map */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              Location
            </Text>
            <Text variant="body" color="secondary" style={styles.mapSubtitle}>
              {property.location.city}, {property.location.country}
            </Text>
            <MapPreview
              latitude={property.location.lat}
              longitude={property.location.lng}
              title={property.title}
              address={property.location.address}
            />
          </View>

          {/* Bottom padding for fixed button */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text variant="h3" style={styles.price}>
              {formatPrice(property.pricePerNight)}
            </Text>
            <Text variant="body" color="secondary">
              /night
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Book Now" onPress={handleBookNow} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 12,
  },
  typebadge: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingText: {
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: (SCREEN_WIDTH - 64) / 2,
  },
  amenityText: {
    flex: 1,
  },
  mapSubtitle: {
    marginBottom: 12,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceSection: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontWeight: '700',
  },
  buttonContainer: {
    flex: 1,
  },
});

