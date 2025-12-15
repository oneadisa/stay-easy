// import React from 'react';
// import { Home, Calendar, User, PlusCircle, LucideIcon } from 'lucide-react-native';
// import { useTheme } from './ThemeProvider';

// interface TabIconProps {
//   name: 'home' | 'bookings' | 'profile' | 'host';
//   focused: boolean;
//   size?: number;
// }

// const iconMap: Record<TabIconProps['name'], LucideIcon> = {
//   home: Home,
//   bookings: Calendar,
//   profile: User,
//   host: PlusCircle,
// };

// export function TabIcon({ name, focused, size = 24 }: TabIconProps) {
//   const { theme } = useTheme();
//   const Icon = iconMap[name];
  
//   const color = focused ? theme.colors.primary : theme.colors.textSecondary;
  
//   return <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
// }


import React from 'react';
import { Home, Calendar, User, PlusCircle, Heart, LucideIcon } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

// Update the type to include 'heart'
interface TabIconProps {
  name: 'home' | 'bookings' | 'profile' | 'host' | 'heart';
  focused: boolean;
  size?: number;
}

// Update the icon map to include Heart
const iconMap: Record<TabIconProps['name'], LucideIcon> = {
  home: Home,
  bookings: Calendar,
  profile: User,
  host: PlusCircle,
  heart: Heart, // Add this line
};

export function TabIcon({ name, focused, size = 24 }: TabIconProps) {
  const { theme } = useTheme();
  const Icon = iconMap[name];
  
  const color = focused ? theme.colors.primary : theme.colors.textSecondary;
  
  return <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
}