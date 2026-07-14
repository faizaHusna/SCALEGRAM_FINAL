import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Logo from "@/presentation/components/Logo";

import { Colors } from "@/core/theme/colors";
import { Typography } from "@/core/theme/typography";
import { Spacing } from "@/core/theme/spacing";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <Logo />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  title: {
    fontSize: Typography.h2,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: Spacing.md,
  },

  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.bodySmall,
    color: Colors.light.subText,
    textAlign: "center",
  },
});