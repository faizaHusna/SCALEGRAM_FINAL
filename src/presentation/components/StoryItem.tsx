import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";

interface Props {
  username: string;
}

export default function StoryItem({ username }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B5CF6", "#6D5DF6", "#A855F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.storyRing}
      >
        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>
      </LinearGradient>

      <Text
        numberOfLines={1}
        style={styles.username}
      >
        {username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 18,
    width: 74,
  },

  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,

    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",
  },

  initial: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.light.primary,
  },

  username: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.light.text,
  },
});