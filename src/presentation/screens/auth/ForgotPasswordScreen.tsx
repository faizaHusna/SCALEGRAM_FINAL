import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AuthCard from "@/presentation/components/AuthCard";
import Button from "@/presentation/components/Button";
import GradientHeader from "@/presentation/components/GradientHeader";
import Input from "@/presentation/components/Input";
import Screen from "@/presentation/components/Screen";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Spacing } from "@/core/theme/spacing";
import { Typography } from "@/core/theme/typography";

import { resetPassword } from "@/data/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const { loading, setLoading } = useAuthStore();

  async function handleResetPassword() {
    if (!email) {
      Alert.alert("Oops", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email);

      Alert.alert(
        "Success",
        "Password reset link has been sent to your email."
      );

      router.replace("/login");
    } catch (error: any) {
      Alert.alert(
        "Reset Password Failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <GradientHeader />

      <AuthCard>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.subtitle}>
          Enter your email to receive a reset link
        </Text>

        <View style={{ height: 30 }} />

        <Input
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Remember your password?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/login")}
          >
            <Text style={styles.register}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </AuthCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 29,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  },

  subtitle: {
    marginTop: 8,
    fontSize: Typography.body,
    fontFamily: Fonts.regular,
    color: Colors.light.subText,
    marginBottom: Spacing.lg,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  footerText: {
    fontFamily: Fonts.regular,
    color: Colors.light.subText,
    fontSize: Typography.bodySmall,
  },

  register: {
    marginLeft: 5,
    color: Colors.light.primary,
    fontFamily: Fonts.semiBold,
  },
});