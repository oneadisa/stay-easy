import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';

export default function BookingsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>
          My Bookings
        </Text>
        
        <Card style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>
            No bookings yet
          </Text>
          <Text variant="body" color="secondary">
            Your upcoming and past bookings will appear here
          </Text>
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
});
