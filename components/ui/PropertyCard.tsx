import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { useTheme } from '../ThemeProvider';
import { Property } from '../../lib/properties';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <Card style={styles.card}>
      {property.images[0] && (
        <Image source={{ uri: property.images[0] }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="h3" style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <Text variant="caption" color="secondary">
              {property.type} • {property.bedrooms} bed • {property.bathrooms} bath
            </Text>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text variant="body" color="secondary">
            {property.location.city}, {property.location.country}
          </Text>
        </View>
        <Text variant="h3" style={styles.price}>
          ${property.pricing.perNight}/night
        </Text>
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
  image: {
    width: '100%',
    height: 200,
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
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  price: {
    color: '#10B981',
  },
});