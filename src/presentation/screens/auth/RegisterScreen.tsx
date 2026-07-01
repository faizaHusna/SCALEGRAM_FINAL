import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";

import AuthCard from "@/presentation/components/AuthCard";
import Button from "@/presentation/components/Button";
import GradientHeader from "@/presentation/components/GradientHeader";
import Input from "@/presentation/components/Input";
import Screen from "@/presentation/components/Screen";

import { Colors } from "@/core/theme/colors";
import { Spacing } from "@/core/theme/spacing";
import { Typography } from "@/core/theme/typography";
import { Fonts } from "@/core/theme/fonts";

import { register } from "@/data/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const { loading, setLoading, setUser } =
    useAuthStore();

  async function handleRegister() {
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Oops",
        "Please fill in all fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Oops",
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Oops",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential = await register(
        username,
        email,
        password
      );

      setUser(userCredential.user);

      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      router.replace("/login");
    } catch (error: any) {
      Alert.alert(
        "Register Failed",
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
        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join ScaleGram today
        </Text>

        <View style={{ height: 30 }} />

        <Input
          icon="person-outline"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <Input
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Input
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Input
          icon="shield-checkmark-outline"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/login")
            }
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
