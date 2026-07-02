import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";

interface Props {
  username: string;
  caption: string;
  likes: number;
}

export default function PostCard({
  username,
  caption,
  likes,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.user}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.username}>
              {username}
            </Text>

            <Text style={styles.time}>
              2 min ago
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color="#8B8B8B"
          />
        </TouchableOpacity>
      </View>

      {/* Image Placeholder */}
      <View style={styles.image}>
        <Ionicons
          name="image-outline"
          size={55}
          color="#BDBDBD"
        />

        <Text style={styles.placeholder}>
          No Image Yet
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons
            name="heart-outline"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="paper-plane-outline"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity>
          <Ionicons
            name="bookmark-outline"
            size={23}
            color="#222"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>
        {likes} Likes
      </Text>

      <Text style={styles.caption}>
        <Text style={styles.captionUser}>
          {username}
        </Text>{" "}
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,

    ...Shadows.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 16,
  },

  user: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,

    backgroundColor: "#EFE8FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },

  username: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.light.text,
  },

  time: {
    marginTop: 2,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "#999",
  },

  image: {
    height: 300,

    borderRadius: 22,

    backgroundColor: "#F4F5F7",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },

  placeholder: {
    marginTop: 10,

    fontFamily: Fonts.medium,
    color: "#9A9A9A",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  likes: {
    fontFamily: Fonts.bold,
    fontSize: 15,

    color: Colors.light.text,

    marginBottom: 8,
  },

  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.text,

    lineHeight: 22,
  },

  captionUser: {
    fontFamily: Fonts.bold,
  },
});