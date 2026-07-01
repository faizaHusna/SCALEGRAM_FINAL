import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "@/core/theme/colors";

interface Props {
  children: ReactNode;
}

export default function AuthCard({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,

    marginTop: -110,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
});