import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { useProperties } from '../utils/PropertiesContext';
import { Text } from '../components/ui/Text';
import { Heart, MapPin, Star, Bed, Users, Bath } from 'lucide-react-native';
import PropertyDetailModal from '../components/ui/PropertyDetailModal';
import { Property } from '../lib/properties';
import { useFavorites } from '../state/favouritesStore';
import { SAMPLE_PROPERTIES } from '../utils/sampleProperties'; 

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (width - (CARD_PADDING * 2) - CARD_GAP) / 2;

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { favorites } = useFavorites();
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const sampleIds = new Set(SAMPLE_PROPERTIES.map((p) => p.id));
  const userProperties = properties.filter((p) => !sampleIds.has(p.id));
  const displayProperties = [...userProperties, ...SAMPLE_PROPERTIES];

  const favoriteProperties = displayProperties.filter(property => 
    favorites.includes(property.id!)
  );

  useEffect(() => {
    console.log('Favorites state:', favorites);
    console.log('Total properties:', displayProperties.length);
    console.log('Favorite properties found:', favoriteProperties.length);
  }, [favorites, displayProperties]);

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const renderPropertyCard = ({ item, index }: { item: Property; index: number }) => (
    <TouchableOpacity
      style={[
        styles.propertyCard,
        { 
          backgroundColor: theme.colors.surface,
          marginLeft: index % 2 === 0 ? 0 : CARD_GAP / 2,
          marginRight: index % 2 === 0 ? CARD_GAP / 2 : 0,
        }
      ]}
      onPress={() => handlePropertyPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={[styles.heartBadge, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
          <Heart size={16} color="#FF385C" fill="#FF385C" />
        </View>

      </View>

      <View style={styles.propertyInfo}>
        <Text variant="body" style={styles.propertyTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.locationRow}>
          <MapPin size={13} color={theme.colors.textSecondary} />
          <Text variant="caption" color="secondary" style={styles.locationText} numberOfLines={1}>
            {item.location.city}
          </Text>
        </View>

        <View style={styles.amenitiesRow}>
          <View style={styles.amenityItem}>
            <Bed size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="secondary" style={styles.amenityText}>
              {item.bedrooms}
            </Text>
          </View>
          <View style={styles.amenityDivider} />
          <View style={styles.amenityItem}>
            <Users size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="secondary" style={styles.amenityText}>
              {item.guests}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <View style={styles.priceContent}>
            <Text variant="body" style={[styles.price, { color: theme.colors.primary }]}>
              ₦{item.pricing.perNight.toLocaleString()}
            </Text>
            <Text variant="caption" color="secondary" style={styles.priceLabel}>
              /night
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text variant="heading" style={styles.headerTitle}>Your Favorites</Text>
            <Text variant="caption" color="secondary" style={styles.headerSubtitle}>
              {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
            </Text>
          </View>
        </View>

        {favoriteProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surface }]}>
              <Heart size={48} color={theme.colors.textSecondary} strokeWidth={1.5} />
            </View>
            <Text variant="title" style={styles.emptyTitle}>
              No favorites yet
            </Text>
            <Text variant="body" color="secondary" style={styles.emptyText}>
              Start exploring and save your favorite properties by tapping the heart icon
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteProperties}
            renderItem={renderPropertyCard}
            keyExtractor={(item) => item.id!}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        )}

        <PropertyDetailModal
          visible={showPropertyModal}
          property={selectedProperty}
          onClose={() => setShowPropertyModal(false)}
          onBookNow={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: CARD_PADDING,
  },
  header: { 
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: { 
    paddingBottom: 24,
  },
  propertyCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amenityDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  amenityText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
  },
});