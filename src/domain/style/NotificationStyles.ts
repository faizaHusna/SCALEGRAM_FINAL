import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

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
  headerSpacer: {
    width: 24,
  } as ViewStyle,
  listContent: {
    paddingVertical: 8,
  } as ViewStyle,
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f9f9f9",
    backgroundColor: "#fff",
  } as ViewStyle,
  unreadCard: {
    backgroundColor: "#F9F8FF",
  } as ViewStyle,
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  contentContainer: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  } as ViewStyle,
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  } as ViewStyle,
  titleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  } as TextStyle,
  timeText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
    marginLeft: 6,
  } as TextStyle,
  bodyText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#666",
    lineHeight: 18,
  } as TextStyle,
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5F4BB6",
    marginLeft: 4,
  } as ViewStyle,
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyText: {
    marginTop: 12,
    fontFamily: Fonts.medium,
    color: "#8e8e93",
  } as TextStyle,
});