import { Dimensions, SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');

export const SkeletonLoader = ({ theme }: { theme: any }) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <View>
            <View style={[styles.skeletonLine, { width: 120, height: 16, marginBottom: 8 }]} />
            <View style={[styles.skeletonLine, { width: 200, height: 24 }]} />
          </View>
          <View style={[styles.skeletonCircle, { width: 44, height: 44 }]} />
        </View>

        {/* Search Bar Skeleton */}
        <View style={styles.searchContainer}>
          <View style={[styles.skeletonSearch, { backgroundColor: theme.colors.surface }]} />
        </View>

        {/* Categories Skeleton */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
            {[1, 2, 3, 4, 5].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.skeletonChip, 
                  { backgroundColor: theme.colors.surfaceAlt }
                ]} 
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Properties Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.skeletonLine, { width: 150, height: 20 }]} />
            <View style={[styles.skeletonLine, { width: 60, height: 16 }]} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredContent}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.skeletonFeaturedCard}>
                <View style={[styles.skeletonImage, { height: 200 }]} />
                <View style={styles.skeletonFeaturedContent}>
                  <View style={[styles.skeletonLine, { width: '80%', height: 18, marginBottom: 8 }]} />
                  <View style={[styles.skeletonLine, { width: '60%', height: 14, marginBottom: 12 }]} />
                  <View style={[styles.skeletonLine, { width: '40%', height: 16 }]} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* All Properties Skeleton */}
        <View style={styles.section}>
          <View style={[styles.skeletonLine, { width: 120, height: 20, marginBottom: 16 }]} />
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View key={item} style={styles.skeletonPropertyCard}>
                <View style={[styles.skeletonImage, { height: 140 }]} />
                <View style={styles.skeletonPropertyContent}>
                  <View style={[styles.skeletonLine, { width: '90%', height: 16, marginBottom: 6 }]} />
                  <View style={[styles.skeletonLine, { width: '70%', height: 12, marginBottom: 8 }]} />
                  <View style={styles.skeletonPropertyDetails}>
                    <View style={[styles.skeletonLine, { width: 30, height: 12 }]} />
                    <View style={[styles.skeletonLine, { width: 30, height: 12 }]} />
                  </View>
                  <View style={styles.skeletonPropertyFooter}>
                    <View style={[styles.skeletonLine, { width: 50, height: 16 }]} />
                    <View style={[styles.skeletonLine, { width: 40, height: 16 }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredContent: {
    gap: 16,
  },
  // Skeleton specific styles
  skeletonLine: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonCircle: {
    backgroundColor: '#E5E7EB',
    borderRadius: 22,
  },
  skeletonSearch: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  skeletonChip: {
    width: 80,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  skeletonFeaturedCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  skeletonImage: {
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  skeletonFeaturedContent: {
    padding: 16,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skeletonPropertyCard: {
    width: (width - 56) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  skeletonPropertyContent: {
    padding: 12,
  },
  skeletonPropertyDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  skeletonPropertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});