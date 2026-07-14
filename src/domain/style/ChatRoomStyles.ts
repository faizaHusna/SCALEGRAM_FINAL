import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
  } as ViewStyle,
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  } as ViewStyle,
  backButton: {
    padding: 2,
    marginRight: 10,
  } as ViewStyle,
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
    marginRight: 12,
  } as ImageStyle,
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  } as TextStyle,
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  } as ViewStyle,
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    width: "100%",
  } as ViewStyle,
  myMessageRow: {
    justifyContent: "flex-end",
  } as ViewStyle,
  theirMessageRow: {
    justifyContent: "flex-start",
  } as ViewStyle,
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  } as ViewStyle,
  myBubble: {
    backgroundColor: "#5F4BB6",
    borderBottomRightRadius: 2,
  } as ViewStyle,
  theirBubble: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 2,
  } as ViewStyle,
  messageText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  } as TextStyle,
  myMessageText: {
    color: "#fff",
  } as TextStyle,
  theirMessageText: {
    color: Colors.light.text,
  } as TextStyle,
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  } as ViewStyle,
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.light.text,
  } as TextStyle,
  sendButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5F4BB6",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  mediaMessageWrapper: {
  borderRadius: 16,
  overflow: 'hidden',
  maxWidth: '75%', // Agar ukurannya proporsional seperti bubble chat
} as ViewStyle,
chatMediaDisplay: {
  width: 220,
  height: 160,
} as ImageStyle,
});