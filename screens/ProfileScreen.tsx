import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../components/ThemeProvider';
import { useAuthUser } from '../state/authStore';
import { logout } from '../lib/auth';

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>
          Profile
        </Text>

        {user && (
          <Card style={styles.card}>
            <Text variant="h3" style={styles.cardTitle}>
              Account
            </Text>
            <Text variant="body" style={styles.cardText}>
              {user.displayName || 'User'}
            </Text>
            <Text variant="caption" color="secondary" style={styles.cardText}>
              {user.email}
            </Text>
            <Button 
              title="Sign Out"
              onPress={handleLogout}
              variant="outline"
              style={styles.button}
            />
          </Card>
        )}
        
        <Card style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>
            Theme Settings
          </Text>
          <Text variant="body" color="secondary" style={styles.cardText}>
            Current mode: {mode}
          </Text>
          <Button 
            title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            onPress={toggleTheme}
            style={styles.button}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardText: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
