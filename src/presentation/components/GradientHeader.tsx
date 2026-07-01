import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Wave from "./Wave";
import { Fonts } from "@/core/theme/fonts";
import { Gradients } from "@/core/theme/gradients";

export default function GradientHeader() {
  return (
    <View>
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <Text style={styles.logo}>ScaleGram</Text>

        <Text style={styles.subtitle}>
          Capture. Share. Connect.
        </Text>

        <View style={styles.wave}>
          <Wave />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 330,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 85,
    overflow: "hidden",
  },

  logo: {
    color: "#fff",
    fontSize: 52,
    fontFamily: Fonts.logo,

    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 10,
    color: "#fff",
    fontSize: 18,
    fontFamily: Fonts.medium,
    opacity: 0.95,
  },

  wave: {
    position: "absolute",
    bottom: -2,
    width: "100%",
    zIndex: 5,
  },

  circle1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -90,
    left: -120,
  },

  circle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    right: -100,
  },
});