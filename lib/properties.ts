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
  imageUri: string 
): Promise<string> => {
  try {
    const newProperty: Property = {
      id: generateId(),
      userId,
      ...propertyData,
      images: [imageUri], 
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