import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Input, Button, Card } from '../../components/ui';
import { useTheme } from '../../components/ThemeProvider';
import { resetPassword } from '../../lib/auth';
import { KeyRound } from 'lucide-react-native';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      Alert.alert(
        'Email Sent',
        'Check your email for a password reset link.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Reset Failed',
        error.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <KeyRound size={32} color={theme.colors.primary} />
            </View>
            <Text variant="display" style={styles.title}>
              Reset Password
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {success ? (
            <Card style={styles.card}>
              <Text variant="body" color="success" style={styles.successText}>
                ✓ Password reset email sent! Check your inbox.
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => navigation.navigate('SignIn')}
                style={styles.button}
              />
            </Card>
          ) : (
            <Card style={styles.card}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={error}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Button
                title={loading ? 'Sending...' : 'Send Reset Link'}
                onPress={handleResetPassword}
                disabled={loading}
                style={styles.button}
              />

              <Button
                title="Back to Sign In"
                onPress={() => navigation.navigate('SignIn')}
                variant="outline"
                size="sm"
                style={styles.backButton}
              />
            </Card>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 12,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
