import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useTheme } from "../components/ThemeProvider";
import { Search, X, Bell, MapPin, Star, Heart, Home, Bed, Users } from "lucide-react-native";
import { useAuthUser } from "../state/authStore";
import { useProperties } from "../utils/PropertiesContext";
import { useBookings } from "../utils/BookingContext";
import { PropertyCardSkeleton } from "../components/ui/SkeletonLoader";
import { ImageCached } from "../components/ui/ImageCached";
import { SAMPLE_PROPERTIES } from "../utils/sampleProperties";
import PropertyDetailModal from "../components/ui/PropertyDetailModal";
import BookingConfirmationModal from "../components/ui/BookingConfirmationModal";
import BookingSuccessModal from "../components/ui/BookingSuccessModal";
import { Property, updatePropertyPrices } from "../lib/properties";
import { BookingDates } from "../types/bookings";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [bookingDates, setBookingDates] = useState<BookingDates>({
    checkIn: null,
    checkOut: null,
  });
  const [guests, setGuests] = useState(1);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState("");

  // Use properties from context
  const { properties, refreshProperties, loading } = useProperties();
  const { addBooking } = useBookings();

  // Update property prices on mount if needed
  useEffect(() => {
    updatePropertyPrices().catch(console.error);
  }, []);

  const categories = [
    "All",
    "Apartment",
    "House",
    "Villa",
    "Condo",
    "Townhouse",
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProperties();
    setRefreshing(false);
  };

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleBookNow = (
    property: Property,
    dates: BookingDates,
    guestCount: number
  ) => {
    setBookingDates(dates);
    setGuests(guestCount);
    setShowPropertyModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = () => {
    if (
      !selectedProperty ||
      !bookingDates.checkIn ||
      !bookingDates.checkOut ||
      !user
    ) {
      console.error("Missing required booking data");
      return;
    }

    try {
      const nights = Math.ceil(
        (bookingDates.checkOut.getTime() - bookingDates.checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const totalPrice =
        selectedProperty.pricing.perNight * nights +
        selectedProperty.pricing.cleaningFee;

      const bookingData = {
        propertyId: selectedProperty.id!,
        userId: user.uid,
        checkIn: bookingDates.checkIn.toISOString(),
        checkOut: bookingDates.checkOut.toISOString(),
        guests: guests,
        totalPrice: totalPrice,
        status: "confirmed" as const,
        property: {
          title: selectedProperty.title,
          images: selectedProperty.images,
          location: selectedProperty.location,
          pricing: selectedProperty.pricing,
        },
      };

      addBooking(bookingData);

      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCurrentBookingId(bookingId);
      setShowConfirmationModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("There was an error processing your booking. Please try again.");
    }
  };

  const handleViewBookings = () => {
    setShowSuccessModal(false);
    setSelectedProperty(null);

    navigation.navigate("Bookings");
  };

  const handleCloseModals = () => {
    setShowPropertyModal(false);
    setShowConfirmationModal(false);
    setShowSuccessModal(false);
    setSelectedProperty(null);
    setBookingDates({ checkIn: null, checkOut: null });
    setGuests(1);
  };

  // Always combine user properties with sample properties
  // Filter out any duplicates (in case a sample property was somehow saved)
  const sampleIds = new Set(SAMPLE_PROPERTIES.map(p => p.id));
  const userProperties = properties.filter(p => !sampleIds.has(p.id));
  const displayProperties = [...userProperties, ...SAMPLE_PROPERTIES];

  const filteredProperties = displayProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      property.location.country
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || property.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPropertiesByCategory = (category: string) => {
    if (category === "All") return filteredProperties;
    return filteredProperties.filter((property) => property.type === category);
  };

  const getFeaturedProperties = () => {
    const userProperties = displayProperties.filter(
      (p) => !p.id?.startsWith("sample-")
    );
    const sampleProperties = displayProperties.filter((p) =>
      p.id?.startsWith("sample-")
    );

    return [...userProperties, ...sampleProperties].slice(0, 3);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={{ padding: 20 }}>
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  const featuredProperties = getFeaturedProperties();
  const categoryProperties = getPropertiesByCategory(selectedCategory);

  const calculateTotalPrice = () => {
    if (!selectedProperty || !bookingDates.checkIn || !bookingDates.checkOut)
      return 0;

    try {
      const nights = Math.ceil(
        (bookingDates.checkOut.getTime() - bookingDates.checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return (
        selectedProperty.pricing.perNight * nights +
        selectedProperty.pricing.cleaningFee
      );
    } catch (error) {
      console.error("Error calculating price:", error);
      return 0;
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="body" color="secondary" style={styles.greeting}>
              {getGreeting()}, {user?.displayName?.split(" ")[0] || "Guest"} 👋
            </Text>
            <Text variant="heading" style={styles.headerTitle}>
              Find Your Perfect Stay
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: theme.colors.surface },
            ]}
            activeOpacity={0.7}
          >
            <Bell size={24} color={theme.colors.textPrimary} />
            <View
              style={[styles.badge, { backgroundColor: theme.colors.primary }]}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar - Sticky */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[
                styles.searchInput,
                { color: theme.colors.textPrimary, fontFamily: 'MontserratAlternates-Regular' },
              ]}
              placeholder="Search destinations, cities, or properties..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category
                      ? theme.colors.primary
                      : theme.colors.surface,
                  borderColor:
                    selectedCategory === category
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={{
                  ...styles.categoryText,
                  color:
                    selectedCategory === category
                      ? "#FFFFFF"
                      : theme.colors.textPrimary,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Section */}
        {featuredProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="title">Featured Properties</Text>
              <TouchableOpacity>
                <Text variant="body" style={{ ...styles.seeAll, color: theme.colors.primary }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContent}
            >
              {featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={[
                    styles.featuredCard,
                    {
                      backgroundColor: theme.colors.surface,
                      shadowColor: theme.mode === "dark" ? "#FFF" : "#000",
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handlePropertyPress(property)}
                >
                  <Image
                    source={{
                      uri:
                        property.images?.[0] && property.images[0].trim().length > 0
                          ? property.images[0]
                          : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                    }}
                    style={styles.featuredImage}
                    onError={() => {
                      // Fallback handled by defaultSource if needed
                    }}
                  />
                  <View style={styles.featuredBadge}>
                    <Star size={12} color="#FFF" fill="#FFF" />
                    <Text variant="caption" style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  <View
                    style={[
                      styles.featuredInfo,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Text
                      variant="title"
                      style={styles.featuredTitle}
                      numberOfLines={1}
                    >
                      {property.title}
                    </Text>
                    <View style={styles.featuredLocation}>
                      <MapPin size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="secondary">
                        {property.location.city}, {property.location.country}
                      </Text>
                    </View>
                    <View style={styles.featuredFooter}>
                      <Text
                        variant="title"
                        style={{ color: theme.colors.primary }}
                      >
                        ₦{property.pricing.perNight.toLocaleString()}
                      </Text>
                      <Text variant="caption" color="secondary">
                        /night
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="title" style={styles.sectionTitle}>
              {selectedCategory === "All"
                ? "All Properties"
                : selectedCategory + "s"}
            </Text>
            <Text variant="caption" color="secondary">
              {categoryProperties.length}{" "}
              {categoryProperties.length === 1 ? "property" : "properties"}
            </Text>
          </View>

          {categoryProperties.length === 0 ? (
            <Card style={styles.emptyCard}>
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              >
                <Home size={48} color={theme.colors.primary} />
              </View>
              <Text variant="title" style={styles.emptyTitle}>
                {searchQuery
                  ? "No matches found"
                  : `No ${selectedCategory.toLowerCase()} properties`}
              </Text>
              <Text variant="body" color="secondary" style={styles.emptyText}>
                {searchQuery
                  ? `Try adjusting your search or browse all properties`
                  : selectedCategory === "All"
                    ? "Start exploring amazing places or list your own property"
                    : `No ${selectedCategory.toLowerCase()} properties available. Try another category.`}
              </Text>
              {selectedCategory !== "All" && (
                <Button
                  title="View All Properties"
                  onPress={() => setSelectedCategory("All")}
                  style={styles.emptyButton}
                />
              )}
            </Card>
          ) : (
            <View style={styles.grid}>
              {categoryProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={[
                    styles.propertyCard,
                    {
                      backgroundColor: theme.colors.surface,
                      shadowColor: theme.mode === "dark" ? "#FFF" : "#000",
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handlePropertyPress(property)}
                >
                  <Image
                    source={{
                      uri:
                        property.images?.[0] && property.images[0].trim().length > 0
                          ? property.images[0]
                          : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                    }}
                    style={styles.propertyImage}
                    onError={() => {
                      // Fallback handled
                    }}
                  />
                  {!property.id?.startsWith("sample-") && (
                    <View style={styles.userPropertyBadge}>
                      <Star size={12} color="#FFF" fill="#FFF" />
                      <Text variant="caption" style={styles.userPropertyBadgeText}>
                        Your Listing
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    activeOpacity={0.7}
                  >
                    <Heart size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.propertyInfo}>
                    <Text
                      variant="body"
                      style={styles.propertyTitle}
                      numberOfLines={1}
                    >
                      {property.title}
                    </Text>
                    <View style={styles.propertyLocation}>
                      <MapPin size={12} color={theme.colors.textSecondary} />
                      <Text
                        variant="caption"
                        color="secondary"
                        numberOfLines={1}
                      >
                        {property.location.city}, {property.location.country}
                      </Text>
                    </View>
                    <View style={styles.propertyDetails}>
                      <View style={styles.propertyDetailItem}>
                        <Bed size={14} color={theme.colors.textSecondary} />
                        <Text variant="caption" color="secondary">
                          {property.bedrooms}
                        </Text>
                      </View>
                      <View style={styles.propertyDetailItem}>
                        <Users size={14} color={theme.colors.textSecondary} />
                        <Text variant="caption" color="secondary">
                          {property.guests}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.propertyFooter}>
                      <View>
                        <Text
                          variant="body"
                          style={{
                            ...styles.propertyPrice,
                            color: theme.colors.primary,
                          }}
                        >
                          ₦{property.pricing.perNight.toLocaleString()}
                        </Text>
                        <Text variant="caption" color="secondary">
                          per night
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.ratingBadge,
                          { backgroundColor: theme.colors.primaryLight },
                        ]}
                      >
                        <Star size={12} color={theme.colors.primary} fill={theme.colors.primary} />
                        <Text
                          style={{
                            ...styles.ratingText,
                            color: theme.colors.primary,
                          }}
                        >
                          4.8
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Booking Modals */}
      <PropertyDetailModal
        visible={showPropertyModal}
        property={selectedProperty}
        onClose={() => setShowPropertyModal(false)}
        onBookNow={handleBookNow}
      />

      <BookingConfirmationModal
        visible={showConfirmationModal}
        property={selectedProperty}
        dates={bookingDates}
        guests={guests}
        totalPrice={calculateTotalPrice()}
        onClose={handleCloseModals}
        onConfirm={handleConfirmBooking}
        onBack={() => {
          setShowConfirmationModal(false);
          setShowPropertyModal(true);
        }}
      />

      <BookingSuccessModal
        visible={showSuccessModal}
        property={selectedProperty}
        bookingId={currentBookingId}
        dates={
          bookingDates.checkIn && bookingDates.checkOut
            ? { checkIn: bookingDates.checkIn, checkOut: bookingDates.checkOut }
            : { checkIn: new Date(), checkOut: new Date() }
        }
        totalPrice={calculateTotalPrice()}
        onClose={handleCloseModals}
        onViewBookings={handleViewBookings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'MontserratAlternates-Regular',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  featuredContent: {
    gap: 16,
  },
  featuredCard: {
    width: width * 0.75,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredInfo: {
    padding: 16,
  },
  featuredTitle: {
    marginBottom: 6,
  },
  featuredLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingBottom: 24,
  },
  propertyCard: {
    width: (width - 56) / 2,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 140,
  },
  userPropertyBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userPropertyBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  propertyInfo: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  propertyLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  propertyDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  propertyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
