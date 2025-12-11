import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Property {
  id: string;
  userId: string;
  title: string;
  type: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  amenities: string[];
  images: string[]; 
  pricing: {
    perNight: number;
    cleaningFee: number;
  };
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

const PROPERTIES_KEY = 'user_properties';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createProperty = async (
  userId: string,
  propertyData: Omit<Property, 'id' | 'userId' | 'images' | 'createdAt' | 'updatedAt' | 'status'>,
  imageUris: string[] 
): Promise<string> => {
  try {
    // Ensure we have valid images - add default if empty
    const defaultImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';
    const validImages = imageUris && imageUris.length > 0 
      ? imageUris.filter(uri => uri && uri.trim().length > 0)
      : [defaultImage];
    
    // Ensure at least one image
    if (validImages.length === 0) {
      validImages.push(defaultImage);
    }
    
    const newProperty: Property = {
      id: generateId(),
      userId,
      ...propertyData,
      images: validImages, 
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingProperties = await getUserProperties(userId);
    
    const updatedProperties = [...existingProperties, newProperty];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
    
    return newProperty.id;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const getUserProperties = async (userId: string): Promise<Property[]> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return [];
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    
    // Filter properties by userId and sort by creation date (newest first)
    return allProperties
      .filter(property => property.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting user properties:', error);
    return [];
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return [];
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    
    // Return only active properties sorted by creation date (newest first)
    return allProperties
      .filter(property => property.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting all properties:', error);
    return [];
  }
};

export const updateProperty = async (
  propertyId: string,
  updates: Partial<Property>
): Promise<void> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return;
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    
    // Find and update the property
    const updatedProperties = allProperties.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return property;
    });
    
    // Save updated list
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

// Utility function to update properties with unrealistic prices to realistic Nigerian prices
// Also ensures all properties have valid images
export const updatePropertyPrices = async (): Promise<void> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return;
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    const defaultImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';
    
    const updatedProperties = allProperties.map(property => {
      let needsUpdate = false;
      const updates: Partial<Property> = {};
      
      // Ensure images array exists and has valid images
      if (!property.images || property.images.length === 0) {
        updates.images = [defaultImage];
        needsUpdate = true;
      } else {
        // Filter out empty/invalid image URLs
        const validImages = property.images.filter(img => img && img.trim().length > 0);
        if (validImages.length === 0) {
          updates.images = [defaultImage];
          needsUpdate = true;
        } else if (validImages.length !== property.images.length) {
          updates.images = validImages;
          needsUpdate = true;
        }
      }
      
      // Check if price is in dollars (less than 1000 NGN is unrealistic for Nigerian properties)
      // Or if it's a villa with very low price
      const isUnrealisticPrice = property.pricing.perNight < 1000 || 
        (property.type.toLowerCase().includes('villa') && property.pricing.perNight < 50000);
      
      if (isUnrealisticPrice) {
        // Set realistic prices based on property type
        let perNight = 25000; // Default for apartments
        let cleaningFee = 3000;
        
        if (property.type.toLowerCase().includes('villa')) {
          perNight = 85000;
          cleaningFee = 10000;
        } else if (property.type.toLowerCase().includes('house')) {
          perNight = 55000;
          cleaningFee = 6000;
        } else if (property.type.toLowerCase().includes('condo')) {
          perNight = 35000;
          cleaningFee = 4000;
        } else if (property.type.toLowerCase().includes('townhouse')) {
          perNight = 95000;
          cleaningFee = 12000;
        }
        
        updates.pricing = {
          perNight,
          cleaningFee,
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        return {
          ...property,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return property;
    });
    
    // Save updated list
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
    console.log('Property prices and images updated');
  } catch (error) {
    console.error('Error updating property prices:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return;
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    
    // Filter out the property to delete
    const updatedProperties = allProperties.filter(property => property.id !== propertyId);
    
    // Save updated list
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

// Optional: Helper function to clear all properties (useful for testing)
export const clearAllProperties = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROPERTIES_KEY);
  } catch (error) {
    console.error('Error clearing properties:', error);
    throw error;
  }
};

// Debug: Get all stored properties regardless of user
export const debugGetAllStoredProperties = async (): Promise<Property[]> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) {
      console.log('DEBUG: No properties in storage');
      return [];
    }
    const allProperties: Property[] = JSON.parse(propertiesJson);
    console.log('DEBUG: All stored properties:', allProperties.length);
    allProperties.forEach(p => {
      console.log(`  - ${p.title} (userId: ${p.userId}, id: ${p.id})`);
    });
    return allProperties;
  } catch (error) {
    console.error('DEBUG: Error getting properties:', error);
    return [];
  }
};

// Migrate properties with different userId to current user
export const migratePropertiesToUser = async (userId: string): Promise<number> => {
  try {
    const propertiesJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    if (!propertiesJson) return 0;
    
    const allProperties: Property[] = JSON.parse(propertiesJson);
    let migratedCount = 0;
    
    const updatedProperties = allProperties.map(property => {
      // If property is not a sample and userId doesn't match current user, migrate it
      if (!property.id?.startsWith('sample-') && property.userId !== userId) {
        migratedCount++;
        return {
          ...property,
          userId: userId,
          updatedAt: new Date().toISOString(),
        };
      }
      return property;
    });
    
    if (migratedCount > 0) {
      await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
      console.log(`DEBUG: Migrated ${migratedCount} properties to user ${userId}`);
    }
    
    return migratedCount;
  } catch (error) {
    console.error('Error migrating properties:', error);
    return 0;
  }
};

// Create a sample user property for testing
export const createSampleUserProperty = async (userId: string): Promise<string> => {
  const sampleProperty: Property = {
    id: 'user-test-' + Date.now().toString(36),
    userId: userId,
    title: 'My Test Property in Lagos',
    type: 'Apartment',
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    location: {
      address: '15 Marina Road',
      city: 'Lagos',
      country: 'Nigeria',
    },
    amenities: ['WiFi', 'AC', 'TV', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    pricing: {
      perNight: 35000,
      cleaningFee: 4000,
    },
    description: 'A cozy test property to verify the system works.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
  };

  try {
    const existingJson = await AsyncStorage.getItem(PROPERTIES_KEY);
    const existingProperties: Property[] = existingJson ? JSON.parse(existingJson) : [];
    
    // Don't add if already exists for this user
    const hasTestProperty = existingProperties.some(p => p.userId === userId && p.title.includes('Test Property'));
    if (hasTestProperty) {
      console.log('DEBUG: Test property already exists for user');
      return 'exists';
    }
    
    existingProperties.push(sampleProperty);
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(existingProperties));
    console.log('DEBUG: Created sample property for user:', userId);
    return sampleProperty.id;
  } catch (error) {
    console.error('DEBUG: Error creating sample property:', error);
    throw error;
  }
};
