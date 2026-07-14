import React, { useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/core/theme/colors";

interface InputProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Input({
  icon,
  secureTextEntry,
  ...props
}: InputProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const [focused, setFocused] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View
      style={[
        styles.container,
        focused && styles.containerFocused,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={focused ? Colors.light.primary : "#9CA3AF"}
        style={styles.icon}
      />

      <TextInput
        {...props}
        secureTextEntry={isPassword ? hidePassword : false}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {isPassword && (
        <Pressable
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={
              hidePassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={22}
            color="#9CA3AF"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    paddingHorizontal: 18,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#ECECEC",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },

  containerFocused: {
    borderColor: Colors.light.primary,
    borderWidth: 1.5,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,

    ...(Platform.OS === "web"
    ? ({
        outlineStyle: "none",
      } as any)
    : {}),
  },
});