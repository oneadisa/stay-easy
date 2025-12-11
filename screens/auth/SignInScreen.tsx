import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Input, PasswordInput, Button } from "../../components/ui";
import { useTheme } from "../../components/ThemeProvider";
import { emailSignIn, googleSignIn } from "../../lib/auth";
import { Home, ArrowRight } from 'lucide-react-native';

export default function SignInScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await emailSignIn(email, password);
      // Navigation will be handled automatically by auth state change
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert(
        "Sign In Failed",
        error.message || "An error occurred. Please try again."
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
      console.error("Google sign in error:", error);
      Alert.alert(
        "Google Sign In Failed",
        error.message || "An error occurred. Please try again."
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Home size={40} color="#FFFFFF" />
            </View>
            <Text variant="display" style={styles.brandName}>
              StayEasy
            </Text>
            <Text variant="body" color="secondary" style={styles.tagline}>
              Find your perfect stay, anywhere
            </Text>
          </View>

          <View style={styles.welcomeSection}>
            <Text variant="heading" style={styles.welcomeTitle}>
              Welcome back
            </Text>
            <Text
              variant="body"
              color="secondary"
              style={styles.welcomeSubtitle}
            >
              Sign in to explore amazing places
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              placeholder="Enter your password"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPasswordLink}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={[
                  styles.forgotPasswordText,
                  { color: theme.colors.primary },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <Button
              title={loading ? "Signing in..." : "Sign in"}
              onPress={handleSignIn}
              disabled={loading}
              style={styles.signInButton}
              rightIcon={
                !loading ? (
                  <ArrowRight size={20} color="#FFFFFF" />
                ) : undefined
              }
            />

            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <Text variant="body" color="secondary" style={styles.dividerText}>
                or continue with
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>

            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="outline"
              disabled={loading}
              style={styles.googleButton}
              leftIcon={undefined}
            />
          </View>

          <View style={styles.signUpSection}>
            <Text variant="body" color="secondary" style={styles.signUpText}>
              New to StayEasy?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={[styles.signUpLink, { color: theme.colors.primary }]}
              >
                Create an account
              </Text>
            </TouchableOpacity>
          </View>

          <Text variant="caption" color="secondary" style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
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
    padding: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    textAlign: "center",
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  signInButton: {
    marginBottom: 20,
    height: 52,
    borderRadius: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  signUpSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  signUpText: {
    fontSize: 15,
  },
  signUpLink: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 4,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
});
