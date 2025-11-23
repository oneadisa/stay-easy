import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from './ui/Text';
import { useTheme } from './ThemeProvider';
import { Property } from '../types';
import { MapPin, Star } from 'lucide-react-native';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Account for padding

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  // Use placeholder if image fails to load
  const imageSource = imageError || !property.images[0]
    ? { uri: 'https://via.placeholder.com/800x600?text=No+Image' }
    : { uri: property.images[0] };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Property Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        {property.rating && (
          <View style={[styles.ratingBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text variant="caption" style={styles.ratingText}>
              {property.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Property Info */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text variant="h4" numberOfLines={1} style={styles.title}>
          {property.title}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MapPin size={14} color={theme.colors.textSecondary} />
          <Text variant="body" color="secondary" numberOfLines={1} style={styles.locationText}>
            {property.location.city}, {property.location.country}
          </Text>
        </View>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <Text variant="caption" color="secondary">
            {property.maxGuests} guests · {property.bedrooms} beds · {property.bathrooms} baths
          </Text>
        </View>

        {/* Price and Reviews */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text variant="h4" style={styles.price}>
              {formatPrice(property.pricePerNight)}
            </Text>
            <Text variant="caption" color="secondary">
              /night
            </Text>
          </View>
          {property.reviewCount > 0 && (
            <Text variant="caption" color="secondary">
              {property.reviewCount} reviews
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    flex: 1,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontWeight: '700',
  },
});

