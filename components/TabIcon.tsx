import React from 'react';
import { Home, Calendar, User, PlusCircle, LucideIcon } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

interface TabIconProps {
  name: 'home' | 'bookings' | 'profile' | 'host';
  focused: boolean;
  size?: number;
}

const iconMap: Record<TabIconProps['name'], LucideIcon> = {
  home: Home,
  bookings: Calendar,
  profile: User,
  host: PlusCircle,
};

export function TabIcon({ name, focused, size = 24 }: TabIconProps) {
  const { theme } = useTheme();
  const Icon = iconMap[name];
  
  const color = focused ? theme.colors.primary : theme.colors.textSecondary;
  
  return <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
}
