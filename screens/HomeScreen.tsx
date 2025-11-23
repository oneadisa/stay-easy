import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '../components/ui/Text';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyListSkeleton } from '../components/PropertyListSkeleton';
import { SearchFilterModal } from '../components/SearchFilterModal';
import { useTheme } from '../components/ThemeProvider';
import { Property, RootStackParamList, FilterParams } from '../types';
import { fetchProperties, PropertyFilters } from '../lib/firestore';
import { Search, Filter, X } from 'lucide-react-native';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Initial load
  useEffect(() => {
    loadProperties();
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0 || properties.length > 0) {
      loadProperties();
    }
  }, [filters]);

  const loadProperties = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setLastDoc(null);
        setHasMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const { properties: newProperties, lastDoc: newLastDoc } = await fetchProperties(
        filters,
        10
      );

      setProperties(newProperties);
      setLastDoc(newLastDoc);
      setHasMore(newProperties.length === 10);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreProperties = async () => {
    if (loadingMore || !hasMore || !lastDoc) return;

    try {
      setLoadingMore(true);
      const { properties: newProperties, lastDoc: newLastDoc } = await fetchProperties(
        filters,
        10,
        lastDoc
      );

      if (newProperties.length > 0) {
        setProperties((prev) => [...prev, ...newProperties]);
        setLastDoc(newLastDoc);
        setHasMore(newProperties.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more properties:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(() => {
    loadProperties(true);
  }, [filters]);

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  const handleSearchPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilters = (newFilters: FilterParams) => {
    // Convert FilterParams to PropertyFilters
    const propertyFilters: PropertyFilters = {
      location: newFilters.location,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      propertyType: newFilters.propertyType,
      minGuests: newFilters.minGuests,
    };
    setFilters(propertyFilters);
  };

  const handleRemoveFilter = (key: keyof PropertyFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="h2" style={styles.headerTitle}>
        Explore Stays
      </Text>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Search size={20} color={theme.colors.textSecondary} />
          <Text variant="body" color="secondary" style={styles.searchPlaceholder}>
            {filters.location || 'Where are you going?'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: hasActiveFilters ? theme.colors.primary : theme.colors.surface,
            },
          ]}
          onPress={handleFilterPress}
          activeOpacity={0.7}
        >
          <Filter
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : theme.colors.textPrimary}
          />
          {hasActiveFilters && (
            <View style={styles.filterBadge}>
              <Text variant="caption" style={styles.filterBadgeText}>
                {Object.keys(filters).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <View style={styles.filterChipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.location && (
              <View
                style={[styles.filterChip, { backgroundColor: theme.colors.surface }]}
              >
                <Text variant="caption" style={styles.filterChipText}>
                  {filters.location}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFilter('location')}>
                  <X size={14} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <View
                style={[styles.filterChip, { backgroundColor: theme.colors.surface }]}
              >
                <Text variant="caption" style={styles.filterChipText}>
                  ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleRemoveFilter('minPrice');
                    handleRemoveFilter('maxPrice');
                  }}
                >
                  <X size={14} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.propertyType && (
              <View
                style={[styles.filterChip, { backgroundColor: theme.colors.surface }]}
              >
                <Text variant="caption" style={styles.filterChipText}>
                  {filters.propertyType}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFilter('propertyType')}>
                  <X size={14} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.minGuests && filters.minGuests > 1 && (
              <View
                style={[styles.filterChip, { backgroundColor: theme.colors.surface }]}
              >
                <Text variant="caption" style={styles.filterChipText}>
                  {filters.minGuests}+ guests
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFilter('minGuests')}>
                  <X size={14} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.clearAllButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleClearAllFilters}
            >
              <Text variant="caption" style={styles.clearAllText}>
                Clear All
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="h3" style={styles.emptyTitle}>
        No properties found
      </Text>
      <Text variant="body" color="secondary" style={styles.emptySubtitle}>
        Try adjusting your filters or check back later
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="h3" style={styles.emptyTitle}>
        Oops! Something went wrong
      </Text>
      <Text variant="body" color="secondary" style={styles.emptySubtitle}>
        {error}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => loadProperties(true)}
      >
        <Text variant="body" style={styles.retryButtonText}>
          Try Again
          </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  if (loading && properties.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        <PropertyListSkeleton count={3} />
      </View>
    );
  }

  if (error && properties.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard property={item} onPress={() => handlePropertyPress(item.id)} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMoreProperties}
        onEndReachedThreshold={0.5}
        contentContainerStyle={properties.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />

      {/* Search & Filter Modal */}
      <SearchFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  filterChipsContainer: {
    marginTop: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  filterChipText: {
    fontWeight: '500',
  },
  clearAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
