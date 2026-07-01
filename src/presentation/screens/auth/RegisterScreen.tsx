import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AuthCard from "@/presentation/components/AuthCard";
import Button from "@/presentation/components/Button";
import GradientHeader from "@/presentation/components/GradientHeader";
import Input from "@/presentation/components/Input";
import Screen from "@/presentation/components/Screen";

import { Colors } from "@/core/theme/colors";
import { Spacing } from "@/core/theme/spacing";
import { Typography } from "@/core/theme/typography";
import { Fonts } from "@/core/theme/fonts";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleLogin() {
    console.log("Login");
  }

  return (
    <Screen>
      <GradientHeader />

      <AuthCard>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>Join ScaleGram today</Text>

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

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button title="Create Account" onPress={handleLogin} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>

          <TouchableOpacity>
            <Text style={styles.register}>Login</Text>
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

  forgot: {
    alignSelf: "flex-end",
    marginBottom: 25,
    color: Colors.light.primary,
    fontFamily: Fonts.medium,
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
