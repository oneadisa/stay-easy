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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './Text';
import { Input } from './Input';
import { Button } from './Button';
import { useTheme } from '../ThemeProvider';
import { X, CheckCircle, Circle, XCircle, CloudUpload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { createProperty } from '../../lib/properties';
import { useAuthUser } from '../../state/authStore';

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (propertyData: any, imageUris: string[]) => void;
}

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse'];
const AMENITIES = ['WiFi', 'Kitchen', 'Parking', 'Pool', 'AC', 'TV', 'Washer', 'Gym'];

export default function AddPropertyModal({ visible, onClose, onSuccess }: AddPropertyModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
    setSelectedImages([]);
    setPrice('');
    setCleaningFee('0');
    setDescription('');
  };

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing when multiple selection is enabled
        quality: 0.8,
        allowsMultipleSelection: true, // Allow multiple selection
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUris = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImageUris]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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

    if (selectedImages.length === 0) {
      Alert.alert('Images Required', 'Please select at least one property image.');
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

      await onSuccess(propertyData, selectedImages);
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
        return selectedImages.length > 0; // At least one image required
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
            <Text variant="title" style={styles.stepTitle}>Property Basics</Text>
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
                  <Text variant="caption" style={type === t ? { ...styles.typeText, color: '#FFFFFF' } : styles.typeText}>{t}</Text>
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
            <Text variant="title" style={styles.stepTitle}>Location</Text>
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
            <Text variant="title" style={styles.stepTitle}>Amenities</Text>
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
                  {selectedAmenities.includes(amenity) ? (
                    <CheckCircle size={20} color={theme.colors.primary} />
                  ) : (
                    <Circle size={20} color={theme.colors.textSecondary} />
                  )}
                  <Text variant="caption" style={styles.amenityText}>{amenity}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text variant="title" style={styles.stepTitle}>Property Photos</Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Add photos of your property (at least 1, up to 10)
            </Text>
            
            {selectedImages.length > 0 && (
              <View style={styles.imagesGrid}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => removeImage(index)}
                    >
                      <XCircle size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {selectedImages.length < 10 && (
              <TouchableOpacity
                style={[styles.uploadButton, { borderColor: theme.colors.border }]}
                onPress={pickImages}
              >
                <CloudUpload size={48} color={theme.colors.primary} />
                <Text variant="body" style={styles.uploadText}>
                  {selectedImages.length === 0 ? 'Choose Photos' : 'Add More Photos'}
                </Text>
                <Text variant="caption" color="secondary" style={styles.uploadSubtext}>
                  {selectedImages.length === 0 
                    ? 'Select images of your property' 
                    : `${selectedImages.length} photo${selectedImages.length === 1 ? '' : 's'} selected`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 5:
        return (
          <View>
            <Text variant="title" style={styles.stepTitle}>Pricing & Description</Text>
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Input
                  label="Price per Night (₦)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="25000"
                />
              </View>
              <View style={styles.inputHalf}>
                <Input
                  label="Cleaning Fee (₦)"
                  value={cleaningFee}
                  onChangeText={setCleaningFee}
                  keyboardType="numeric"
                  placeholder="3000"
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
    
    if (step > 1 || title || selectedImages.length > 0) {
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
        <View 
          style={[
            styles.header, 
            { 
              borderBottomColor: theme.colors.border,
              paddingTop: insets.top + 8,
            }
          ]}
        >
          <TouchableOpacity 
            onPress={handleClose} 
            disabled={loading}
            style={styles.closeButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="title">Add Property</Text>
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
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        {/* Footer */}
        <View 
          style={[
            styles.footer, 
            { 
              borderTopColor: theme.colors.border,
              paddingBottom: insets.bottom + 8,
            }
          ]}
        >
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
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
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 32,
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
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imagePreviewContainer: {
    width: '48%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
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