import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from './ThemeProvider';

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ImageCarousel({ images, height = 300 }: ImageCarouselProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.placeholderContainer, { backgroundColor: theme.colors.border }]}>
          <Image
            source={{ uri: 'https://via.placeholder.com/800x600?text=No+Image' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((imageUri, index) => (
          <View key={index} style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
            <Image
              source={
                imageErrors[index]
                  ? { uri: 'https://via.placeholder.com/800x600?text=Image+Error' }
                  : { uri: imageUri }
              }
              style={styles.image}
              resizeMode="cover"
              onError={() => handleImageError(index)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  width: index === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <View style={styles.counterContainer}>
          <View style={styles.counterBadge}>
            <View style={styles.counterText}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <View style={{ backgroundColor: '#FFFFFF', width: 4, height: 4, borderRadius: 2 }} />
                <View style={{ backgroundColor: '#FFFFFF', width: 4, height: 4, borderRadius: 2 }} />
                <View style={{ backgroundColor: '#FFFFFF', width: 4, height: 4, borderRadius: 2 }} />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  counterContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  counterBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

