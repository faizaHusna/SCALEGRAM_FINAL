import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Fonts } from "@/core/theme/fonts";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#8B5CF6", "#7C3AED", "#6366F1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Text style={styles.logo}>
        ScaleGram
      </Text>

      <Text style={styles.tagline}>
        Capture. Share. Connect.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  logo: {
    fontSize: 56,
    color: "#FFF",
    fontFamily: Fonts.logo,
    letterSpacing: -1,
  },

  tagline: {
    marginTop: 12,
    color: "#FFF",
    fontSize: 18,
    fontFamily: Fonts.medium,
    opacity: 0.95,
  },

  circle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -120,
    left: -120,
  },

  circle2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -70,
    right: -90,
  },
});