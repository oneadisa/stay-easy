/**
 * Price calculation utilities for booking flow
 */

/**
 * Calculate total price for a booking
 * @param pricePerNight Price per night
 * @param nights Number of nights
 * @param guests Number of guests (optional, for future per-guest pricing)
 * @returns Total price
 */
export const computeTotal = (
  pricePerNight: number,
  nights: number,
  guests: number = 1
): number => {
  if (nights < 1) return 0;
  
  const basePrice = pricePerNight * nights;
  
  // Optional: Add per-guest fee (e.g., $10 per guest per night after 2 guests)
  // For now, we'll keep it simple and just use base price
  // const guestFee = guests > 2 ? (guests - 2) * 10 * nights : 0;
  
  return basePrice;
};

/**
 * Format price to currency string
 * @param amount Price amount
 * @param currency Currency code (default: 'NGN')
 * @returns Formatted price string (e.g., "₦150,000")
 */
export const formatPrice = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate price breakdown for booking
 * @param pricePerNight Price per night
 * @param nights Number of nights
 * @param guests Number of guests
 * @returns Object with price breakdown
 */
export const calculatePriceBreakdown = (
  pricePerNight: number,
  nights: number,
  guests: number = 1
) => {
  const basePrice = pricePerNight * nights;
  const serviceFee = Math.round(basePrice * 0.12); // 12% service fee
  const cleaningFee = 1000; // Fixed cleaning fee in Naira
  const total = basePrice + serviceFee + cleaningFee;

  return {
    basePrice,
    nights,
    pricePerNight,
    serviceFee,
    cleaningFee,
    total,
  };
};

/**
 * Format price breakdown for display
 * @param breakdown Price breakdown object
 * @returns Array of formatted price lines
 */
export const formatPriceBreakdown = (breakdown: {
  basePrice: number;
  nights: number;
  pricePerNight: number;
  serviceFee: number;
  cleaningFee: number;
  total: number;
}): Array<{ label: string; value: string }> => {
  return [
    {
      label: `${formatPrice(breakdown.pricePerNight)} × ${breakdown.nights} ${breakdown.nights === 1 ? 'night' : 'nights'}`,
      value: formatPrice(breakdown.basePrice),
    },
    {
      label: 'Service fee',
      value: formatPrice(breakdown.serviceFee),
    },
    {
      label: 'Cleaning fee',
      value: formatPrice(breakdown.cleaningFee),
    },
    {
      label: 'Total',
      value: formatPrice(breakdown.total),
    },
  ];
};

