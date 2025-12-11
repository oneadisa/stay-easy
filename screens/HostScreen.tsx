import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';
import { Home, DollarSign, TrendingUp, Plus } from 'lucide-react-native';
import { useAuthUser } from '../state/authStore';
import { Property, getUserProperties, deleteProperty, createProperty, debugGetAllStoredProperties, createSampleUserProperty, migratePropertiesToUser, getAllProperties } from '../lib/properties';
import { useProperties } from '../utils/PropertiesContext';
import { useBookings } from '../utils/BookingContext';
import { SAMPLE_PROPERTIES } from '../utils/sampleProperties';
import AddPropertyModal from '../components/ui/AddPropertyModal';
import PropertyCard from '../components/ui/PropertyCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HostScreen() {
  const { theme } = useTheme();
  const { user } = useAuthUser();
  const { refreshProperties: refreshGlobalProperties } = useProperties();
  const { allBookings, refreshBookings } = useBookings();
  const [modalVisible, setModalVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh bookings when component mounts or user changes (only once)
  useEffect(() => {
    if (user) {
      refreshBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); // Only depend on user.uid, not the whole user object or refreshBookings

  // Calculate bookings count for user's properties
  // IMPORTANT: Count bookings by propertyId, not userId (bookings are made by guests, not hosts)
  const getBookingsCount = () => {
    if (!user || properties.length === 0) return 0;
    
    const userPropertyIds = new Set(properties.map(p => p.id));
    
    // Count bookings for properties owned by this user (regardless of who made the booking)
    // Use allBookings instead of bookings (which only shows bookings made BY the user)
    const matchingBookings = allBookings.filter(booking => 
      userPropertyIds.has(booking.propertyId) && 
      booking.status !== 'cancelled'
    );
    
    return matchingBookings.length;
  };

  const loadProperties = async () => {
    if (!user) {
      console.log('DEBUG: No user, cannot load properties');
      setLoading(false);
      return;
    }
    try {
      console.log('DEBUG: Loading properties for user:', user.uid);
      
      // Migrate any properties with wrong userId to current user
      const migratedCount = await migratePropertiesToUser(user.uid);
      if (migratedCount > 0) {
        console.log(`DEBUG: Migrated ${migratedCount} properties to current user`);
      }
      
      // Debug: Show all stored properties
      await debugGetAllStoredProperties();
      
      // Get all non-sample properties (user-created properties)
      const allProps = await getAllProperties();
      const sampleIds = new Set(SAMPLE_PROPERTIES.map(p => p.id));
      const userProps = allProps.filter(p => !sampleIds.has(p.id));
      
      console.log('DEBUG: User properties found:', userProps.length);
      setProperties(userProps);
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateTestProperty = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }
    try {
      setLoading(true);
      const id = await createSampleUserProperty(user.uid);
      await loadProperties();
      await refreshGlobalProperties();
      Alert.alert('Success', id === 'exists' ? 'Test property already exists!' : 'Test property created!');
    } catch (error) {
      console.error('Error creating test property:', error);
      Alert.alert('Error', 'Failed to create test property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBookings(); // Refresh bookings first
    await loadProperties();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
      Alert.alert('Success', 'Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      Alert.alert('Error', 'Failed to delete property');
    }
  };

  const handleAddProperty = async (propertyData: any, imageUris: string[]) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newPropertyId = await createProperty(user.uid, propertyData, imageUris);
      await loadProperties(); // Reload user properties for this screen
      await refreshGlobalProperties(); // Refresh global context so HomeScreen updates
      setModalVisible(false);
      Alert.alert('Success', 'Property added successfully');
    } catch (error) {
      console.error('Error adding property:', error);
      Alert.alert('Error', 'Failed to add property');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text variant="heading" style={styles.title}>
              Host Dashboard
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Manage your properties and earnings
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Home size={24} color={theme.colors.primary} />
              <Text variant="heading" style={styles.statNumber}>
                {properties.length}
              </Text>
              <Text variant="caption" color="secondary">
                Properties
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <TrendingUp size={24} color={theme.colors.primary} />
              <Text variant="heading" style={styles.statNumber}>
                {getBookingsCount()}
              </Text>
              <Text variant="caption" color="secondary">
                Bookings
              </Text>
            </Card>
          </View>

          {/* Add Property CTA */}
          {properties.length === 0 && (
            <Card variant="elevated" style={styles.ctaCard}>
              <View style={styles.ctaIconContainer}>
                <Plus size={64} color={theme.colors.primary} />
              </View>
              <Text variant="title" style={styles.ctaTitle}>
                List Your First Property
              </Text>
              <Text variant="body" color="secondary" style={styles.ctaText}>
                Start earning by sharing your space with travelers around the world
              </Text>
              <Button
                title="Add Property"
                onPress={() => setModalVisible(true)}
                style={styles.ctaButton}
                leftIcon={<Plus size={20} color="#FFFFFF" />}
              />
              <Button
                title="Quick Test Property"
                onPress={handleCreateTestProperty}
                variant="outline"
                style={[styles.ctaButton, { marginTop: 12 }]}
              />
            </Card>
          )}

          {/* Properties List */}
          {properties.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="title">Your Properties</Text>
                <Button
                  title="Add New"
                  onPress={() => setModalVisible(true)}
                  size="sm"
                  leftIcon={<Plus size={18} color="#FFFFFF" />}
                />
              </View>
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <AddPropertyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleAddProperty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    marginVertical: 8,
  },
  ctaCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  ctaIconContainer: {
    marginBottom: 16,
  },
  ctaTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaButton: {
    minWidth: 200,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
