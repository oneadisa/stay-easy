import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';

export default function HomeScreen() {
  const { theme, setMode, mode } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="h1" style={styles.title}>
          Welcome to StayEasy
        </Text>
        
        <Text variant="body" color="secondary" style={styles.subtitle}>
          Your perfect home away from home
        </Text>

        <Card style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>
            Theme Demo
          </Text>
          <Text variant="body" color="secondary" style={styles.cardText}>
            Current theme: {theme.mode}
          </Text>
          <Button 
            title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            onPress={toggleTheme}
            style={styles.button}
          />
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
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  buttonSmall: {
    flex: 1,
  },
});
