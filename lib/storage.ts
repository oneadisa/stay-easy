import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Convert URI to Blob for upload
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  userId: string, 
  imageUri: string
): Promise<string> => {
  const blob = await uriToBlob(imageUri);
  const storageRef = ref(storage, `avatars/${userId}.jpg`);
  
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

/**
 * Upload property image
 */
export const uploadPropertyImage = async (
  propertyId: string, 
  imageUri: string,
  index: number
): Promise<string> => {
  const blob = await uriToBlob(imageUri);
  const storageRef = ref(storage, `properties/${propertyId}/${index}.jpg`);
  
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

/**
 * Upload multiple property images
 */
export const uploadPropertyImages = async (
  propertyId: string,
  imageUris: string[]
): Promise<string[]> => {
  const uploadPromises = imageUris.map((uri, index) => 
    uploadPropertyImage(propertyId, uri, index)
  );
  
  return Promise.all(uploadPromises);
};

/**
 * Delete image from storage
 */
export const deleteImage = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

/**
 * Delete all property images
 */
export const deletePropertyImages = async (propertyId: string): Promise<void> => {
  // Note: In production, you'd want to list all files first
  // For now, we'll just delete known indices
  const deletePromises = Array.from({ length: 10 }, (_, i) => {
    const path = `properties/${propertyId}/${i}.jpg`;
    return deleteImage(path).catch(() => {}); // Ignore errors for non-existent files
  });
  
  await Promise.all(deletePromises);
};
