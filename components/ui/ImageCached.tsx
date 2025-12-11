import React, { useState } from 'react';
import { View, StyleSheet, Image, ImageStyle } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { SkeletonLoader } from './SkeletonLoader';

interface ImageCachedProps {
  uri: string | null | undefined;
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: boolean;
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

type DimensionValue = number | string | undefined;

export const ImageCached: React.FC<ImageCachedProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  placeholder = true,
  width,
  height,
  borderRadius,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!uri || error) {
    if (placeholder) {
      const viewWidth: DimensionValue = width || '100%';
      const viewHeight = height || 200;
      return (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: theme.colors.skeleton,
              width: viewWidth as any,
              height: viewHeight,
              borderRadius: borderRadius || 0,
            },
            style,
          ]}
        >
          <SkeletonLoader
            width="100%"
            height={viewHeight}
            borderRadius={borderRadius || 0}
          />
        </View>
      );
    }
    return null;
  }

  const imageWidth: DimensionValue = width || '100%';
  const imageHeight = height || 200;
  
  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <SkeletonLoader
            width="100%"
            height={imageHeight}
            borderRadius={borderRadius || 0}
          />
        </View>
      )}
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: imageWidth as any,
            height: imageHeight,
            borderRadius: borderRadius || 0,
          },
          style,
        ]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

