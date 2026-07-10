import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import AuthCard from "@/presentation/components/AuthCard";
import Button from "@/presentation/components/Button";
import GradientHeader from "@/presentation/components/GradientHeader";
import Input from "@/presentation/components/Input";
import Screen from "@/presentation/components/Screen";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Spacing } from "@/core/theme/spacing";
import { Typography } from "@/core/theme/typography";
import { useRegister } from "@/hooks/auth/useRegister";

const RegisterContext = createContext<any>(null);

function RegisterContent() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { registerUser, loading } = useContext(RegisterContext);

  async function handleRegister() {
    if (!nickname || !username || !email || !password || !confirmPassword) {
      Alert.alert("Oops", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Oops", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Oops", "Password must be at least 6 characters.");
      return;
    }

    try {
      await registerUser(nickname, username, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)/feed"); 
    } catch (error: any) {
      Alert.alert("Register Failed", error.message || "Something went wrong.");
    }
  }

  return (
    <View style={styles.container}>
      <GradientHeader />
      <AuthCard>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join ScaleGram today</Text>
        <View style={{ height: 30 }} />

        <Input
          icon="person-circle-outline"
          placeholder="Full Name / Nickname"
          value={nickname}
          onChangeText={setNickname}
          editable={!loading}
        />

        <Input
          icon="person-outline"
          placeholder="Username (e.g. janesmith)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
        <Input
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <Input
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <Input
          icon="shield-checkmark-outline"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <Button title="Create Account" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/login")} disabled={loading}>
            <Text style={styles.register}>Login</Text>
          </Pressable>
        </View>
      </AuthCard>
    </View>
  );
}

export default function RegisterScreen() {
  const registerUseCase = useRegister();

  return (
    <Screen scrollable={true}> 
      <RegisterContext.Provider value={registerUseCase}>
        <RegisterContent />
      </RegisterContext.Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 29, fontFamily: Fonts.bold, color: Colors.light.text },
  subtitle: { marginTop: 8, fontSize: Typography.body, fontFamily: Fonts.regular, color: Colors.light.subText, marginBottom: Spacing.lg },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 35 },
  footerText: { fontFamily: Fonts.regular, color: Colors.light.subText, fontSize: Typography.bodySmall },
  register: { marginLeft: 5, color: Colors.light.primary, fontFamily: Fonts.semiBold },
});