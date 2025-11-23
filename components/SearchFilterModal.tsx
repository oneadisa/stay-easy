import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { useTheme } from './ThemeProvider';
import { FilterParams, PropertyType } from '../types';
import { X, MapPin, DollarSign, Home, Users } from 'lucide-react-native';

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PROPERTY_TYPES: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'other', label: 'Other' },
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function SearchFilterModal({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: SearchFilterModalProps) {
  const { theme } = useTheme();

  const [location, setLocation] = useState(initialFilters.location || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(
    initialFilters.propertyType || ''
  );
  const [minGuests, setMinGuests] = useState(initialFilters.minGuests || 1);

  useEffect(() => {
    if (visible) {
      // Reset to initial filters when modal opens
      setLocation(initialFilters.location || '');
      setMinPrice(initialFilters.minPrice?.toString() || '');
      setMaxPrice(initialFilters.maxPrice?.toString() || '');
      setPropertyType(initialFilters.propertyType || '');
      setMinGuests(initialFilters.minGuests || 1);
    }
  }, [visible, initialFilters]);

  const handleReset = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('');
    setMinGuests(1);
  };

  const handleApply = () => {
    const filters: FilterParams = {};

    if (location.trim()) {
      filters.location = location.trim();
    }

    if (minPrice) {
      const parsed = parseInt(minPrice, 10);
      if (!isNaN(parsed) && parsed > 0) {
        filters.minPrice = parsed;
      }
    }

    if (maxPrice) {
      const parsed = parseInt(maxPrice, 10);
      if (!isNaN(parsed) && parsed > 0) {
        filters.maxPrice = parsed;
      }
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }

    if (minGuests > 1) {
      filters.minGuests = minGuests;
    }

    onApply(filters);
    onClose();
  };

  const hasActiveFilters =
    location.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    propertyType !== '' ||
    minGuests > 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text variant="h3">Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Location Search */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={20} color={theme.colors.primary} />
                <Text variant="h4" style={styles.sectionTitle}>
                  Location
                </Text>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="City or country"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <DollarSign size={20} color={theme.colors.primary} />
                <Text variant="h4" style={styles.sectionTitle}>
                  Price Range (per night)
                </Text>
              </View>
              <View style={styles.priceRow}>
                <View
                  style={[
                    styles.priceInputContainer,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text variant="body" color="secondary" style={styles.priceLabel}>
                    Min
                  </Text>
                  <TextInput
                    style={[styles.priceInput, { color: theme.colors.textPrimary }]}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                  />
                </View>
                <Text variant="body" color="secondary">
                  -
                </Text>
                <View
                  style={[
                    styles.priceInputContainer,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text variant="body" color="secondary" style={styles.priceLabel}>
                    Max
                  </Text>
                  <TextInput
                    style={[styles.priceInput, { color: theme.colors.textPrimary }]}
                    placeholder="1000"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Home size={20} color={theme.colors.primary} />
                <Text variant="h4" style={styles.sectionTitle}>
                  Property Type
                </Text>
              </View>
              <View style={styles.typeGrid}>
                {PROPERTY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor:
                          propertyType === type.value
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => setPropertyType(type.value as PropertyType | '')}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.typeButtonText,
                        {
                          color:
                            propertyType === type.value
                              ? '#FFFFFF'
                              : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Number of Guests */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color={theme.colors.primary} />
                <Text variant="h4" style={styles.sectionTitle}>
                  Number of Guests
                </Text>
              </View>
              <View style={styles.guestsContainer}>
                <TouchableOpacity
                  style={[
                    styles.guestButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setMinGuests(Math.max(1, minGuests - 1))}
                  disabled={minGuests <= 1}
                >
                  <Text
                    variant="h3"
                    style={{ color: minGuests <= 1 ? theme.colors.textSecondary : theme.colors.primary }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <View style={styles.guestValue}>
                  <Text variant="h3">{minGuests}</Text>
                  <Text variant="caption" color="secondary">
                    {minGuests === 1 ? 'guest' : 'guests'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.guestButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setMinGuests(Math.min(20, minGuests + 1))}
                  disabled={minGuests >= 20}
                >
                  <Text
                    variant="h3"
                    style={{ color: minGuests >= 20 ? theme.colors.textSecondary : theme.colors.primary }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity
              onPress={handleReset}
              disabled={!hasActiveFilters}
              style={styles.resetButton}
            >
              <Text
                variant="body"
                style={{
                  color: hasActiveFilters ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <View style={styles.applyButton}>
              <Button title="Apply Filters" onPress={handleApply} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceInput: {
    fontSize: 16,
    padding: 0,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeButtonText: {
    fontWeight: '600',
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  guestButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestValue: {
    alignItems: 'center',
    minWidth: 80,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  applyButton: {
    flex: 2,
  },
});

