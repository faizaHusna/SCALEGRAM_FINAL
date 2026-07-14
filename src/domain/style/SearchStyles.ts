// SearchScreen.styles.ts
import { Fonts } from "@/core/theme/fonts";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 14, color: "#8A8A8A" },
  errorText: { fontSize: 16, color: "#FF3B30", marginTop: 12 },
  retryButton: { marginTop: 16, padding: 10, backgroundColor: "#0095f6", borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "bold" },
  detailContainer: { flex: 1, backgroundColor: "#fff" },
  detailHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#E5E5EA" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  cardContainer: { flex: 1 },
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  
  // Search Bar
  searchBarContainer: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#E5E5EA" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#F2F2F7", borderRadius: 10, paddingHorizontal: 10, height: 40 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, height: "100%", fontSize: 15, color: "#000" },
  clearButton: { padding: 4 },
  
  // Tabs
  searchTabsContainer: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#E5E5EA" },
  searchTabButton: { flex: 1, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  searchTabButtonActive: { borderBottomWidth: 2, borderBottomColor: "#0095f6" },
  searchTabLabel: { fontSize: 14, color: "#8A8A8A", fontFamily: Fonts.bold },
  searchTabLabelActive: { color: "#0095f6", fontFamily: Fonts.bold },
  
  // Trending Tags
  trendingContainer: { padding: 16 },
  trendingHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  trendingTitle: { fontSize: 16, fontFamily: Fonts.bold, color: "#000" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0F8FF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 4 },
  tagChipText: { color: "#0095f6", fontSize: 13, fontWeight: "500" },
  tagBadge: { position: "absolute", bottom: 4, left: 4, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  
  // Accounts List
  accountsList: { padding: 16 },

  // --- STYLING BARU: GRID POSTS (Mirip Profile Screen) ---
  gridContainer: { paddingHorizontal: 2, paddingVertical: 2 },
  gridItemPressable: { flex: 1 / 3, aspectRatio: 1, margin: 2 },
  gridImage: { width: "100%", height: "100%", borderRadius: 8, backgroundColor: "#F4F5F7" },
  videoBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.6)", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  
  // --- STYLING BARU: EMPTY STATE (Mirip Profile Screen) ---
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80, paddingHorizontal: 42, gap: 12 },
  emptyText: { textAlign: "center", color: "#8E8E93", fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
});