import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MapPin, Trash2 } from 'lucide-react-native';
import { Text } from './Text';
import { Card } from './Card';
import { ImageCached } from './ImageCached';
import { useTheme } from '../ThemeProvider';
import { Property } from '../../lib/properties';
import { formatPrice } from '../../utils/price';

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const { theme } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(property.id!),
        },
      ]
    );
  };

  const imageUri = property.images && property.images.length > 0 && property.images[0].trim().length > 0
    ? property.images[0]
    : null;

  const locationText = `${property.location.city}, ${property.location.country}`;

  return (
    <Card style={styles.card}>
      {/* Image with skeleton loading */}
      <ImageCached
        uri={imageUri}
        width="100%"
        height={200}
        borderRadius={0}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="title" style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <Text variant="caption" color="secondary">
              {property.type} • {property.bedrooms} bed • {property.bathrooms} bath
            </Text>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Trash2 size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.location}>
          <MapPin size={16} color={theme.colors.textSecondary} />
          <Text variant="body" color="secondary" style={styles.locationText}>
            {locationText}
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text variant="title" style={[styles.price, { color: theme.colors.primary }]}>
            {formatPrice(property.pricing.perNight)}
          </Text>
          <Text variant="caption" color="secondary">
            /night
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontWeight: '600',
  },
});
