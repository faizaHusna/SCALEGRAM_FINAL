import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/core/theme/colors";
import { Gradients } from "@/core/theme/gradients";

interface Props {
  title: string;
  onPress: () => void;
}

export default function Button({
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
    >
      <LinearGradient
        colors={Gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.text}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
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

  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});