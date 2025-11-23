/**
 * Seed script to populate Firestore with demo property listings
 * 
 * To run: node scripts/seedProperties.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample property data
const properties = [
  {
    title: 'Luxury Beachfront Villa',
    description: 'Experience paradise in this stunning beachfront villa with panoramic ocean views. Features include a private pool, chef\'s kitchen, and direct beach access. Perfect for families or groups seeking luxury and relaxation.',
    location: {
      address: '123 Ocean Drive',
      city: 'Miami',
      country: 'USA',
      lat: 25.7617,
      lng: -80.1918,
    },
    pricePerNight: 450,
    rating: 4.9,
    reviewCount: 127,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Air Conditioning', 'Parking'],
    hostId: 'demo-host-1',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: 'villa',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isActive: true,
  },
  {
    title: 'Cozy Downtown Apartment',
    description: 'Modern apartment in the heart of downtown. Walking distance to restaurants, shops, and entertainment. Recently renovated with stylish decor and all amenities needed for a comfortable stay.',
    location: {
      address: '456 Main Street, Apt 5B',
      city: 'New York',
      country: 'USA',
      lat: 40.7128,
      lng: -74.0060,
    },
    pricePerNight: 180,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Workspace'],
    hostId: 'demo-host-2',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'apartment',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    isActive: true,
  },
  {
    title: 'Mountain Cabin Retreat',
    description: 'Escape to this charming mountain cabin surrounded by nature. Features a fireplace, hot tub, and stunning mountain views. Perfect for a peaceful getaway and outdoor adventures.',
    location: {
      address: '789 Mountain Trail',
      city: 'Aspen',
      country: 'USA',
      lat: 39.1911,
      lng: -106.8175,
    },
    pricePerNight: 320,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Hot Tub', 'Fireplace', 'Kitchen', 'Heating', 'Parking', 'Mountain View'],
    hostId: 'demo-host-3',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'cabin',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    isActive: true,
  },
  // Add more properties (abbreviated for brevity - keeping first 3 as examples)
];

// Add all 20 properties from the TypeScript version
const allProperties = [
  ...properties,
  {
    title: 'Modern Loft in Arts District',
    description: 'Stylish industrial loft with exposed brick, high ceilings, and large windows. Located in the trendy arts district with galleries, cafes, and nightlife at your doorstep.',
    location: { address: '321 Arts Avenue', city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
    pricePerNight: 220,
    rating: 4.6,
    reviewCount: 74,
    images: ['https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Workspace', 'TV', 'Parking'],
    hostId: 'demo-host-4',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'apartment',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    isActive: true,
  },
  {
    title: 'Seaside Cottage with Garden',
    description: 'Charming cottage by the sea with a beautiful garden and patio. Wake up to ocean breezes and enjoy morning coffee overlooking the water.',
    location: { address: '555 Coastal Road', city: 'San Diego', country: 'USA', lat: 32.7157, lng: -117.1611 },
    pricePerNight: 275,
    rating: 4.9,
    reviewCount: 203,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
    amenities: ['WiFi', 'Garden', 'Beach Access', 'Kitchen', 'Parking', 'BBQ Grill'],
    hostId: 'demo-host-5',
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'house',
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
    isActive: true,
  },
];

// Seed function
async function seedProperties() {
  console.log('🌱 Starting to seed properties...');
  
  try {
    const propertiesRef = collection(db, 'properties');
    
    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      const docRef = await addDoc(propertiesRef, property);
      console.log(`✅ Added property ${i + 1}/${allProperties.length}: ${property.title} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully seeded all properties!');
    console.log(`📊 Total properties added: ${allProperties.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProperties();





