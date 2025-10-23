import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';
import { PlusCircle } from 'lucide-react-native';

export default function HostScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>
          Host Dashboard
        </Text>
        
        <Text variant="body" color="secondary" style={styles.subtitle}>
          Manage your properties and bookings
        </Text>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.iconContainer}>
            <PlusCircle size={48} color={theme.colors.primary} />
          </View>
          <Text variant="h3" style={styles.cardTitle}>
            List Your Property
          </Text>
          <Text variant="body" color="secondary" style={styles.cardText}>
            Start earning by listing your space on StayEasy
          </Text>
          <Button 
            title="Add Property"
            onPress={() => {}}
            style={styles.button}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>
            Your Properties
          </Text>
          <Text variant="body" color="secondary">
            You haven't listed any properties yet
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>
            Guest Bookings
          </Text>
          <Text variant="body" color="secondary">
            No bookings for your properties yet
          </Text>
        </Card>
      </View>
    </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
});
