import { ActivityItem } from "@/domain/entities/Activity";
import { styles } from "@/domain/style/ActivityStyles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  item: ActivityItem;
  isFollowing: boolean;
  onPress: (item: ActivityItem) => void;
  onToggleFollow: (username: string) => void;
}

const renderActivityText = (type: ActivityItem["type"]) => {
  switch (type) {
    case "like": return " menyukai foto Anda. ";
    case "comment": return " mengomentari postingan Anda. ";
    case "mention": return " menyebut Anda dalam sebuah komentar. ";
    case "follow": return " mulai mengikuti Anda. ";
    default: return " berinteraksi dengan Anda. ";
  }
};

const renderBadgeIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "like": return <View style={[styles.badgeContainer, { backgroundColor: "#FF2D55" }]}><Ionicons name="heart" size={10} color="#fff" /></View>;
    case "comment": return <View style={[styles.badgeContainer, { backgroundColor: "#34C759" }]}><Ionicons name="chatbubble" size={10} color="#fff" /></View>;
    case "mention": return <View style={[styles.badgeContainer, { backgroundColor: "#AF52DE" }]}><Ionicons name="at" size={10} color="#fff" /></View>;
    case "follow": return <View style={[styles.badgeContainer, { backgroundColor: "#007AFF" }]}><Ionicons name="person-add" size={10} color="#fff" /></View>;
    default: return null;
  }
};

export const ActivityListItem = ({ item, isFollowing, onPress, onToggleFollow }: Props) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.activityCard, item.isUnread && styles.unreadCardBg, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.unreadIndicatorWrapper}>
        {item.isUnread && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} cachePolicy="memory-disk" />
        {renderBadgeIcon(item.type)}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.activityText} numberOfLines={3}>
          <Text style={styles.username}>{item.username}</Text>
          {renderActivityText(item.type)}
          <Text style={styles.timeText}>{item.time}</Text>
        </Text>
        {item.commentText && (
          <View style={styles.commentPreviewBubble}>
            <Text style={styles.commentPreviewText} numberOfLines={1}>"{item.commentText}"</Text>
          </View>
        )}
      </View>

      <View style={styles.rightAction}>
        {item.type === "follow" ? (
          <Pressable onPress={() => onToggleFollow(item.username)} style={[styles.followButton, isFollowing && styles.followingActiveButton]}>
            <Text style={[styles.followButtonText, isFollowing && styles.followingActiveText]}>{isFollowing ? "Mengikuti" : "Ikuti Balik"}</Text>
          </Pressable>
        ) : (
          item.postImage && (
            <View style={styles.thumbnailWrapper}>
              <Image source={{ uri: item.postImage }} style={styles.postThumbnail} cachePolicy="memory-disk" />
              <View style={styles.searchOverlay}>
                <Ionicons name="expand-outline" size={10} color="white" />
              </View>
            </View>
          )
        )}
      </View>
    </Pressable>
  );
};