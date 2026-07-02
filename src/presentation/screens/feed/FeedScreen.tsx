import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";

import Screen from "@/presentation/components/Screen";
import StoryItem from "@/presentation/components/StoryItem";
import PostCard from "@/presentation/components/PostCard";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { getPosts } from "@/data/repositories/postRepository";

const stories = [
  { id: "1", username: "You" },
  { id: "2", username: "Syifa" },
  { id: "3", username: "Hani" },
  { id: "4", username: "Faiza" },
  { id: "5", username: "Luna" },
  { id: "6", username: "Kevin" },
];


export default function FeedScreen() {
  const posts = getPosts();

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.logo}>ScaleGram</Text>
        </View>

        <View style={styles.headerRight}>
          <Ionicons
            name="search-outline"
            size={24}
            color={Colors.light.text}
          />

          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.light.text}
          />
        </View>
      </View>

      {/* Stories */}
      <FlatList
        horizontal
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryItem username={item.username} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
      />

      {/* Posts */}
      <View style={styles.posts}>
  {posts.length === 0 ? (
    <Text style={styles.empty}>
      No posts yet.
    </Text>
  ) : (
    posts.map((post) => (
      <PostCard
        key={post.id}
        username={post.username}
        caption={post.caption}
        likes={post.likes}
      />
    ))
  )}
</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 15,
    color: "#8A8A8A",
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },

  logo: {
    fontSize: 32,
    fontFamily: Fonts.logo,
    color: Colors.light.text,
  },

  headerRight: {
    flexDirection: "row",
    gap: 18,
  },

  storyList: {
    paddingBottom: 24,
    paddingRight: 12,
  },

  posts: {
    paddingBottom: 40,
  },

  empty: {
  marginTop: 40,
  textAlign: "center",
  color: "#999",
  fontFamily: Fonts.medium,
},
});