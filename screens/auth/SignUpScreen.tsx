import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, Input, PasswordInput, Button, Card } from '../../components/ui';
import { useTheme } from '../../components/ThemeProvider';
import { emailSignUp, googleSignIn } from '../../lib/auth';
import { UserPlus } from 'lucide-react-native';

export default function SignUpScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!displayName) {
      newErrors.displayName = 'Name is required';
    } else if (displayName.length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await emailSignUp(email, password, displayName);
      // Navigation will be handled automatically by auth state change
      Alert.alert(
        'Success!',
        'Your account has been created successfully.'
      );
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Sign Up Failed',
        error.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      // Navigation will be handled automatically by auth state change
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Google Sign In Failed',
        error.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <UserPlus size={32} color={theme.colors.primary} />
            </View>
            <Text variant="h1" style={styles.title}>
              Create Account
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Join StayEasy today
            </Text>
          </View>

          <Card style={styles.card}>
            <Input
              label="Full Name"
              value={displayName}
              onChangeText={setDisplayName}
              error={errors.displayName}
              placeholder="John Doe"
              autoCapitalize="words"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="Minimum 6 characters"
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
            />

            <Button
              title={loading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignUp}
              disabled={loading}
              style={styles.button}
            />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text variant="caption" color="secondary" style={styles.dividerText}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              style={styles.googleButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text variant="body" color="secondary">
              Already have an account?{' '}
            </Text>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
              variant="outline"
              size="sm"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  googleButton: {
    marginTop: 8,
  },
});
