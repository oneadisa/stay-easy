import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeProvider';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export function PropertyListSkeleton({ count = 3 }: { count?: number }) {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonCard = () => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Image skeleton */}
      <Animated.View
        style={[
          styles.imageSkeleton,
          {
            backgroundColor: theme.colors.border,
            opacity,
          },
        ]}
      />

      {/* Content skeleton */}
      <View style={styles.contentSkeleton}>
        {/* Title */}
        <Animated.View
          style={[
            styles.titleSkeleton,
            {
              backgroundColor: theme.colors.border,
              opacity,
            },
          ]}
        />

        {/* Location */}
        <Animated.View
          style={[
            styles.locationSkeleton,
            {
              backgroundColor: theme.colors.border,
              opacity,
              marginTop: 8,
            },
          ]}
        />

        {/* Details */}
        <Animated.View
          style={[
            styles.detailsSkeleton,
            {
              backgroundColor: theme.colors.border,
              opacity,
              marginTop: 8,
            },
          ]}
        />

        {/* Price row */}
        <View style={styles.priceRow}>
          <Animated.View
            style={[
              styles.priceSkeleton,
              {
                backgroundColor: theme.colors.border,
                opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.reviewsSkeleton,
              {
                backgroundColor: theme.colors.border,
                opacity,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageSkeleton: {
    width: '100%',
    height: 200,
  },
  contentSkeleton: {
    padding: 12,
  },
  titleSkeleton: {
    height: 20,
    borderRadius: 4,
    width: '80%',
  },
  locationSkeleton: {
    height: 16,
    borderRadius: 4,
    width: '60%',
  },
  detailsSkeleton: {
    height: 14,
    borderRadius: 4,
    width: '50%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceSkeleton: {
    height: 20,
    borderRadius: 4,
    width: 80,
  },
  reviewsSkeleton: {
    height: 14,
    borderRadius: 4,
    width: 60,
  },
});

