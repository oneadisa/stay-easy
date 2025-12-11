import React from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../components/ThemeProvider';
import { useAuthUser } from '../state/authStore';
import { logout } from '../lib/auth';
import { Camera, User, Bookmark, Heart, Wallet, Bell, HelpCircle, ChevronRight, LogOut, Sun, Moon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme, setMode, mode } = useTheme();
  const { user } = useAuthUser();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      onPress: () => console.log('Edit Profile'),
    },
    {
      icon: Bookmark,
      label: 'My Bookings',
      onPress: () => console.log('My Bookings'),
    },
    {
      icon: Heart,
      label: 'Favorites',
      onPress: () => console.log('Favorites'),
    },
    {
      icon: Wallet,
      label: 'Payment Methods',
      onPress: () => console.log('Payment Methods'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight }]}>
                <Text 
                  variant="display" 
                  style={[styles.avatarText, { color: theme.colors.primary }]}
                >
                  {user?.displayName ? getInitials(user.displayName) : 'U'}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: '#FFFFFF' }]}
                activeOpacity={0.7}
              >
                <Camera size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text variant="heading" style={styles.userName}>
              {user?.displayName || 'User'}
            </Text>
            <Text variant="body" color="secondary" style={styles.userEmail}>
              {user?.email}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && styles.menuItemBorder,
                  { borderBottomColor: theme.colors.border },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <item.icon size={22} color={theme.colors.primary} />
                  </View>
                  <Text variant="body" style={styles.menuItemLabel}>
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>

          <Card style={styles.themeCard}>
            <View style={styles.themeHeader}>
              <View style={styles.themeHeaderLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  {mode === 'light' ? (
                    <Sun size={22} color={theme.colors.primary} />
                  ) : (
                    <Moon size={22} color={theme.colors.primary} />
                  )}
                </View>
                <View>
                  <Text variant="body" style={styles.themeTitle}>
                    Appearance
                  </Text>
                  <Text variant="caption" color="secondary">
                    {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.themeToggle,
                  { backgroundColor: mode === 'dark' ? theme.colors.primary : theme.colors.border },
                ]}
                onPress={toggleTheme}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.themeToggleThumb,
                    mode === 'dark' && styles.themeToggleThumbActive,
                    { backgroundColor: '#FFFFFF' },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </Card>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text variant="caption" color="secondary" style={styles.appInfoText}>
              StayEasy v1.0.0
            </Text>
            <Text variant="caption" color="secondary" style={styles.appInfoText}>
              Made with ❤️ for travelers
            </Text>
          </View>

          {/* Logout Button */}
          <Button 
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            leftIcon={<LogOut size={20} color={theme.colors.error} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue'
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    padding: 24,
    paddingTop: 24,
  },
  menuCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeCard: {
    marginBottom: 16,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  themeToggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  themeToggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeToggleThumbActive: {
    alignSelf: 'flex-end',
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: 24,
  },
  appInfoText: {
    marginBottom: 4,
  },
  logoutButton: {
    marginBottom: 32,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
});