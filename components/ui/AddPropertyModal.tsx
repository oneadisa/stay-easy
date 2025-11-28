import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Text } from './Text';
import { Input } from './Input';
import { Button } from './Button';
import { useTheme } from '../ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createProperty } from '../../lib/properties';
import { useAuthUser } from '../../state/authStore';

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (propertyData: any, imageUri: string) => void;
}

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse'];
const AMENITIES = ['WiFi', 'Kitchen', 'Parking', 'Pool', 'AC', 'TV', 'Washer', 'Gym'];

export default function AddPropertyModal({ visible, onClose, onSuccess }: AddPropertyModalProps) {
  const { theme } = useTheme();
  const { user } = useAuthUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Apartment');
  const [guests, setGuests] = useState('2');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [cleaningFee, setCleaningFee] = useState('0');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setType('Apartment');
    setGuests('2');
    setBedrooms('1');
    setBathrooms('1');
    setAddress('');
    setCity('');
    setCountry('');
    setSelectedAmenities([]);
    setSelectedImage(null);
    setPrice('');
    setCleaningFee('0');
    setDescription('');
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: false, // Only allow single selection
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a property.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Image Required', 'Please select one property image.');
      return;
    }

    setLoading(true);
    try {
      const propertyData = {
        title: title.trim(),
        type,
        guests: parseInt(guests) || 1,
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        location: { 
          address: address.trim(), 
          city: city.trim(), 
          country: country.trim() 
        },
        amenities: selectedAmenities,
        pricing: {
          perNight: parseFloat(price) || 0,
          cleaningFee: parseFloat(cleaningFee) || 0,
        },
        description: description.trim(),
      };

      await onSuccess(propertyData, selectedImage);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating property:', error);
      Alert.alert('Error', 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return title.trim() && guests && bedrooms && bathrooms;
      case 2:
        return address.trim() && city.trim() && country.trim();
      case 3:
        return true; // Amenities optional
      case 4:
        return selectedImage !== null; // Only one image required
      case 5:
        return price && description.trim();
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text variant="h3" style={styles.stepTitle}>Property Basics</Text>
            <Input
              label="Property Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Cozy apartment in downtown"
            />
            <Text variant="body" style={styles.label}>Property Type</Text>
            <View style={styles.typeGrid}>
              {PROPERTY_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeButton,
                    { borderColor: theme.colors.border },
                    type === t && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                  ]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeText, type === t && { color: '#FFFFFF' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Input 
                  label="Guests" 
                  value={guests} 
                  onChangeText={setGuests} 
                  keyboardType="numeric" 
                  placeholder="2"
                />
              </View>
              <View style={styles.inputHalf}>
                <Input 
                  label="Bedrooms" 
                  value={bedrooms} 
                  onChangeText={setBedrooms} 
                  keyboardType="numeric" 
                  placeholder="1"
                />
              </View>
            </View>
            <Input 
              label="Bathrooms" 
              value={bathrooms} 
              onChangeText={setBathrooms} 
              keyboardType="numeric" 
              placeholder="1"
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text variant="h3" style={styles.stepTitle}>Location</Text>
            <Input 
              label="Address" 
              value={address} 
              onChangeText={setAddress} 
              placeholder="123 Main St" 
            />
            <Input 
              label="City" 
              value={city} 
              onChangeText={setCity} 
              placeholder="New York" 
            />
            <Input 
              label="Country" 
              value={country} 
              onChangeText={setCountry} 
              placeholder="United States" 
            />
          </View>
        );

      case 3:
        return (
          <View>
            <Text variant="h3" style={styles.stepTitle}>Amenities</Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Select what your property offers
            </Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES.map(amenity => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityButton,
                    { borderColor: theme.colors.border },
                    selectedAmenities.includes(amenity) && {
                      backgroundColor: theme.colors.primaryLight,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Ionicons
                    name={selectedAmenities.includes(amenity) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={selectedAmenities.includes(amenity) ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text variant="h3" style={styles.stepTitle}>Property Photo</Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Add one photo of your property
            </Text>
            
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Ionicons name="close-circle" size={28} color="#EF4444" />
                </TouchableOpacity>
                <Text variant="caption" color="secondary" style={styles.imageHint}>
                  Tap the image to change it
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.uploadButton, { borderColor: theme.colors.border }]}
                onPress={pickImage}
              >
                <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.primary} />
                <Text variant="body" style={styles.uploadText}>Choose Photo</Text>
                <Text variant="caption" color="secondary" style={styles.uploadSubtext}>
                  Select one image of your property
                </Text>
              </TouchableOpacity>
            )}

            {!selectedImage && (
              <TouchableOpacity
                style={[styles.uploadButton, { borderColor: theme.colors.border }]}
                onPress={pickImage}
              >
                <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.primary} />
                <Text variant="body" style={styles.uploadText}>Choose Photo</Text>
                <Text variant="caption" color="secondary" style={styles.uploadSubtext}>
                  Select one image of your property
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 5:
        return (
          <View>
            <Text variant="h3" style={styles.stepTitle}>Pricing & Description</Text>
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Input
                  label="Price per Night ($)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>
              <View style={styles.inputHalf}>
                <Input
                  label="Cleaning Fee ($)"
                  value={cleaningFee}
                  onChangeText={setCleaningFee}
                  keyboardType="numeric"
                  placeholder="20"
                />
              </View>
            </View>
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your property..."
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    if (step > 1 || title || selectedImage) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            }
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="h3">Add Property</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Progress */}
        <View style={styles.progress}>
          {[1, 2, 3, 4, 5].map(s => (
            <View
              key={s}
              style={[
                styles.progressDot,
                { backgroundColor: s <= step ? theme.colors.primary : theme.colors.border },
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          {step > 1 && (
            <Button
              title="Back"
              onPress={() => setStep(step - 1)}
              variant="outline"
              style={styles.footerButton}
              disabled={loading}
            />
          )}
          {step < 5 ? (
            <Button
              title="Next"
              onPress={() => setStep(step + 1)}
              disabled={!canProceed() || loading}
              style={[styles.footerButton, step === 1 ? styles.fullButton : null]}
            />
          ) : (
            <Button
              title={loading ? 'Publishing...' : 'Publish Property'}
              onPress={handleSubmit}
              style={styles.footerButton}
              disabled={!canProceed() || loading}
              leftIcon={loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  stepTitle: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    minWidth: '45%',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 12,
    fontWeight: '600',
  },
  uploadSubtext: {
    marginTop: 4,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  imageHint: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
  fullButton: {
    flex: 1,
  },
});