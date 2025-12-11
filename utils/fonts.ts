import { useFonts } from 'expo-font';
import { PollerOne_400Regular } from '@expo-google-fonts/poller-one';
import {
  MontserratAlternates_100Thin,
  MontserratAlternates_200ExtraLight,
  MontserratAlternates_300Light,
  MontserratAlternates_400Regular,
  MontserratAlternates_500Medium,
  MontserratAlternates_600SemiBold,
  MontserratAlternates_700Bold,
  MontserratAlternates_800ExtraBold,
  MontserratAlternates_900Black,
  MontserratAlternates_100Thin_Italic,
  MontserratAlternates_200ExtraLight_Italic,
  MontserratAlternates_300Light_Italic,
  MontserratAlternates_400Regular_Italic,
  MontserratAlternates_500Medium_Italic,
  MontserratAlternates_600SemiBold_Italic,
  MontserratAlternates_700Bold_Italic,
  MontserratAlternates_800ExtraBold_Italic,
  MontserratAlternates_900Black_Italic,
} from '@expo-google-fonts/montserrat-alternates';

/**
 * Load custom fonts (Poller One for headings, Montserrat Alternates for body)
 * Returns loading state and error state
 */
export const useCustomFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    // Poller One - for headings
    'PollerOne-Regular': PollerOne_400Regular,
    
    // Montserrat Alternates - for body text
    'MontserratAlternates-Thin': MontserratAlternates_100Thin,
    'MontserratAlternates-ExtraLight': MontserratAlternates_200ExtraLight,
    'MontserratAlternates-Light': MontserratAlternates_300Light,
    'MontserratAlternates-Regular': MontserratAlternates_400Regular,
    'MontserratAlternates-Medium': MontserratAlternates_500Medium,
    'MontserratAlternates-SemiBold': MontserratAlternates_600SemiBold,
    'MontserratAlternates-Bold': MontserratAlternates_700Bold,
    'MontserratAlternates-ExtraBold': MontserratAlternates_800ExtraBold,
    'MontserratAlternates-Black': MontserratAlternates_900Black,
    
    // Italic variants
    'MontserratAlternates-ThinItalic': MontserratAlternates_100Thin_Italic,
    'MontserratAlternates-ExtraLightItalic': MontserratAlternates_200ExtraLight_Italic,
    'MontserratAlternates-LightItalic': MontserratAlternates_300Light_Italic,
    'MontserratAlternates-RegularItalic': MontserratAlternates_400Regular_Italic,
    'MontserratAlternates-MediumItalic': MontserratAlternates_500Medium_Italic,
    'MontserratAlternates-SemiBoldItalic': MontserratAlternates_600SemiBold_Italic,
    'MontserratAlternates-BoldItalic': MontserratAlternates_700Bold_Italic,
    'MontserratAlternates-ExtraBoldItalic': MontserratAlternates_800ExtraBold_Italic,
    'MontserratAlternates-BlackItalic': MontserratAlternates_900Black_Italic,
  });

  return { fontsLoaded, fontError };
};

/**
 * Font family mapping for use in styles
 * Poller One for headings, Montserrat Alternates for body text
 */
export const fontFamily = {
  // Headings - Poller One
  heading: 'PollerOne-Regular',
  
  // Body text - Montserrat Alternates
  thin: 'MontserratAlternates-Thin',
  extraLight: 'MontserratAlternates-ExtraLight',
  light: 'MontserratAlternates-Light',
  regular: 'MontserratAlternates-Regular',
  medium: 'MontserratAlternates-Medium',
  semibold: 'MontserratAlternates-SemiBold',
  bold: 'MontserratAlternates-Bold',
  extraBold: 'MontserratAlternates-ExtraBold',
  black: 'MontserratAlternates-Black',
  
  // Italic variants
  thinItalic: 'MontserratAlternates-ThinItalic',
  extraLightItalic: 'MontserratAlternates-ExtraLightItalic',
  lightItalic: 'MontserratAlternates-LightItalic',
  regularItalic: 'MontserratAlternates-RegularItalic',
  mediumItalic: 'MontserratAlternates-MediumItalic',
  semiboldItalic: 'MontserratAlternates-SemiBoldItalic',
  boldItalic: 'MontserratAlternates-BoldItalic',
  extraBoldItalic: 'MontserratAlternates-ExtraBoldItalic',
  blackItalic: 'MontserratAlternates-BlackItalic',
};
