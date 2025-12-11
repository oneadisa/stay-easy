import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
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

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PropertyCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.sm,
        },
      ]}
    >
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.cardContent}>
        <SkeletonLoader width="80%" height={20} style={styles.title} />
        <SkeletonLoader width="60%" height={16} style={styles.subtitle} />
        <View style={styles.row}>
          <SkeletonLoader width={60} height={16} />
          <SkeletonLoader width={80} height={16} />
        </View>
      </View>
    </View>
  );
};

export const PropertyDetailsSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <SkeletonLoader width="100%" height={300} borderRadius={0} />
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <SkeletonLoader width="90%" height={32} style={styles.marginBottom} />
        <SkeletonLoader width="70%" height={20} style={styles.marginBottom} />
        <SkeletonLoader width="100%" height={16} style={styles.marginBottom} />
        <SkeletonLoader width="100%" height={16} style={styles.marginBottom} />
        <SkeletonLoader width="80%" height={16} style={styles.marginBottom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  marginBottom: {
    marginBottom: 12,
  },
});
