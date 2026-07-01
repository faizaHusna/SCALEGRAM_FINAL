import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Colors } from "@/core/theme/colors";
import { Typography } from "@/core/theme/typography";

export default function Logo() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📸</Text>

      <Text style={styles.title}>ScaleGram</Text>

      <Text style={styles.subtitle}>
        Capture. Share. Connect.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },

  icon: {
    fontSize: 60,
    marginBottom: 10,
  },

  title: {
    fontSize: Typography.h1,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  subtitle: {
    marginTop: 8,
    fontSize: Typography.bodySmall,
    color: Colors.light.subText,
  },
});