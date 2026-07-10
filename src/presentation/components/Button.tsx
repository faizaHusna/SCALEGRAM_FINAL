import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Fonts } from "@/core/theme/fonts";
import { Gradients } from "@/core/theme/gradients";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  return (
   
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
    { opacity: pressed ? 0.85 : 1 }
  ]}
    >
      <LinearGradient
        colors={Gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          (loading || disabled) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#6D5DF6",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  disabled: {
    opacity: 0.7,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
});