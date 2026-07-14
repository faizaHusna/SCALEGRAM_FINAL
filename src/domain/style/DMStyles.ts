import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  } as ViewStyle,
  backButton: {
    padding: 2,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  } as TextStyle,
  composeButton: {
    padding: 2,
  } as ViewStyle,
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  } as ViewStyle,
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  } as ViewStyle,
  searchIcon: {
    marginRight: 6,
  } as TextStyle,
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.light.text,
  } as TextStyle,
  listContent: {
    paddingVertical: 4,
  } as ViewStyle,
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  } as ViewStyle,
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eee",
  } as ImageStyle,
  messageContent: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  } as ViewStyle,
  nicknameText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.light.text,
    marginBottom: 3,
  } as TextStyle,
  lastMessageText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
  } as TextStyle,
  unreadMessageText: {
    fontFamily: Fonts.bold,
    color: "#000",
  } as TextStyle,
  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
  } as ViewStyle,
  timeText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
    marginBottom: 6,
  } as TextStyle,
  unreadTimeText: {
    fontFamily: Fonts.bold,
    color: "#5F4BB6",
  } as TextStyle,
  badgeContainer: {
    backgroundColor: "#5F4BB6",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  } as ViewStyle,
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: Fonts.bold,
  } as TextStyle,
  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyText: {
    marginTop: 12,
    fontFamily: Fonts.medium,
    color: "#8e8e93",
  } as TextStyle,
});