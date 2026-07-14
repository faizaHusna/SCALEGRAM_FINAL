import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: { marginTop: 20, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 15, color: "#8A8A8A", fontFamily: Fonts.regular, marginBottom: 4 },
  logo: { fontSize: 32, fontFamily: Fonts.logo, color: Colors.light.text },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 18 },
  storyList: { paddingBottom: 24, paddingRight: 12 },
  empty: { marginTop: 40, textAlign: "center", color: "#999" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 12, textAlign: "center", color: "#666" },
});