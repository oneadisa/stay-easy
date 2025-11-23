import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { Text } from './ui/Text';
import { MapPin } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export function MapPreview({ latitude, longitude, title, address }: MapPreviewProps) {
  const { theme } = useTheme();

  const openInMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent(title);
    
    let url = '';
    
    if (Platform.OS === 'ios') {
      url = `${scheme}?q=${label}&ll=${latLng}`;
    } else {
      url = `${scheme}${latLng}?q=${latLng}(${label})`;
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  // Create a simple placeholder map view
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={openInMaps}
      activeOpacity={0.8}
    >
      {/* Simple visual representation */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineVertical]} />
        
        {/* Marker position */}
        <View style={styles.markerContainer}>
          <View style={styles.marker}>
            <MapPin size={24} color="#FFFFFF" fill="#FF3B30" />
          </View>
        </View>

        {/* Overlay with location info */}
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
          <MapPin size={20} color="#FFFFFF" />
          <View style={styles.textContainer}>
            <Text variant="body" style={styles.overlayTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text variant="caption" style={styles.overlaySubtitle} numberOfLines={1}>
              Tap to open in Maps
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: '#D0D0D0',
  },
  gridLineVertical: {
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  overlayTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  overlaySubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
});

