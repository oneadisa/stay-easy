import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useAuthUser } from '../state/authStore';
import { Property, getUserProperties, deleteProperty, createProperty } from '../lib/properties';
import AddPropertyModal from '../components/ui/AddPropertyModal';
import PropertyCard from '../components/ui/PropertyCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HostScreen() {
  const { theme } = useTheme();
  const { user } = useAuthUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProperties = async () => {
    if (!user) return;
    try {
      const userProps = await getUserProperties(user.uid);
      setProperties(userProps);
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProperties();
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

  const handleAddProperty = async (propertyData: any, imageUri: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newPropertyId = await createProperty(user.uid, propertyData, imageUri);
      await loadProperties(); // Reload to get the updated list
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
            <Text variant="h2" style={styles.title}>
              Host Dashboard
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Manage your properties and earnings
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Ionicons name="home" size={24} color={theme.colors.primary} />
              <Text variant="h2" style={styles.statNumber}>
                {properties.length}
              </Text>
              <Text variant="caption" color="secondary">
                Properties
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={theme.colors.primary} />
              <Text variant="h2" style={styles.statNumber}>
                0
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
                <Ionicons name="add-circle" size={64} color={theme.colors.primary} />
              </View>
              <Text variant="h3" style={styles.ctaTitle}>
                List Your First Property
              </Text>
              <Text variant="body" color="secondary" style={styles.ctaText}>
                Start earning by sharing your space with travelers around the world
              </Text>
              <Button
                title="Add Property"
                onPress={() => setModalVisible(true)}
                style={styles.ctaButton}
                leftIcon={<Ionicons name="add" size={20} color="#FFFFFF" />}
              />
            </Card>
          )}

          {/* Properties List */}
          {properties.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="h3">Your Properties</Text>
                <Button
                  title="Add New"
                  onPress={() => setModalVisible(true)}
                  size="sm"
                  leftIcon={<Ionicons name="add" size={18} color="#FFFFFF" />}
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
