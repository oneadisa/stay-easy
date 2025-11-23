import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Property } from '../types';

// Filter parameters type
export type PropertyFilters = {
  location?: string; // Search in city or country
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minGuests?: number;
  isActive?: boolean;
};

/**
 * Fetch properties with pagination and filters
 */
export const fetchProperties = async (
  filters: PropertyFilters = {},
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ properties: Property[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    const propertiesRef = collection(db, 'properties');
    let q = query(propertiesRef);

    // Apply filters
    const constraints: any[] = [];

    // Always filter for active properties by default
    if (filters.isActive !== false) {
      constraints.push(where('isActive', '==', true));
    }

    // Property type filter
    if (filters.propertyType) {
      constraints.push(where('propertyType', '==', filters.propertyType));
    }

    // Price range filters
    if (filters.minPrice !== undefined) {
      constraints.push(where('pricePerNight', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where('pricePerNight', '<=', filters.maxPrice));
    }

    // Max guests filter
    if (filters.minGuests) {
      constraints.push(where('maxGuests', '>=', filters.minGuests));
    }

    // Location filter (search in city or country)
    // Note: Firestore doesn't support full-text search, so we'll filter in memory
    // For production, consider using Algolia or similar

    // Order by creation date (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    // Pagination
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    q = query(propertiesRef, ...constraints);

    const snapshot = await getDocs(q);
    let properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[];

    // Filter by location in memory if location filter is provided
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      properties = properties.filter(
        (property) =>
          property.location.city.toLowerCase().includes(searchTerm) ||
          property.location.country.toLowerCase().includes(searchTerm)
      );
    }

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { properties, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Fetch a single property by ID
 */
export const fetchPropertyById = async (propertyId: string): Promise<Property | null> => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    const propertySnap = await getDoc(propertyRef);

    if (propertySnap.exists()) {
      return {
        id: propertySnap.id,
        ...propertySnap.data(),
      } as Property;
    }

    return null;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

/**
 * Create a new property
 */
export const createProperty = async (property: Omit<Property, 'id'>): Promise<string> => {
  try {
    const propertiesRef = collection(db, 'properties');
    const docRef = await addDoc(propertiesRef, {
      ...property,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

/**
 * Update an existing property
 */
export const updateProperty = async (
  propertyId: string,
  updates: Partial<Omit<Property, 'id'>>
): Promise<void> => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    await updateDoc(propertyRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

/**
 * Delete a property (soft delete by setting isActive to false)
 */
export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    await updateDoc(propertyRef, {
      isActive: false,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

/**
 * Hard delete a property (permanently remove from database)
 */
export const hardDeleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    await deleteDoc(propertyRef);
  } catch (error) {
    console.error('Error hard deleting property:', error);
    throw error;
  }
};

/**
 * Search properties by location
 */
export const searchPropertiesByLocation = async (
  searchTerm: string,
  pageSize: number = 10
): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(
      propertiesRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize * 3) // Fetch more since we filter in memory
    );

    const snapshot = await getDocs(q);
    const properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[];

    // Filter by location in memory
    const searchTermLower = searchTerm.toLowerCase();
    return properties
      .filter(
        (property) =>
          property.location.city.toLowerCase().includes(searchTermLower) ||
          property.location.country.toLowerCase().includes(searchTermLower) ||
          property.location.address.toLowerCase().includes(searchTermLower)
      )
      .slice(0, pageSize);
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

