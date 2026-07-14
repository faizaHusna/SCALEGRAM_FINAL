import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: { 
    flex: 1 
  },
  title: { 
    fontSize: 30, 
    fontFamily: Fonts.bold, 
    color: Colors.light.text, 
    marginBottom: 24 
  },
  imagePicker: { 
    height: 320, 
    borderRadius: 24, 
    backgroundColor: "#F5F5F7", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 20, 
    ...Shadows.card, 
    overflow: "hidden" 
  },
  image: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 24 
  },
  videoStyle: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 24 
  },
  pickText: { 
    marginTop: 14, 
    fontFamily: Fonts.medium, 
    color: "#8A8A8A", 
    fontSize: 16 
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 24, 
    ...Shadows.card 
  },
  label: { 
    fontFamily: Fonts.semiBold, 
    color: Colors.light.text, 
    marginBottom: 10, 
    fontSize: 16 
  },
  input: { 
    minHeight: 110, 
    textAlignVertical: "top", 
    fontFamily: Fonts.regular, 
    fontSize: 15, 
    color: Colors.light.text 
  },
  counter: { 
    alignSelf: "flex-end", 
    marginTop: 10, 
    fontFamily: Fonts.medium, 
    color: "#9C9C9C" 
  },
  loadingWrapper: { 
    alignItems: "center", 
    marginVertical: 10 
  },
  loadingText: { 
    marginTop: 8, 
    fontFamily: Fonts.medium, 
    color: "#666" 
  },
  imageContainer: { 
    width: "100%", 
    height: "100%", 
    position: "relative" 
  },
  clearButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, 
  },
  pickerOptionsContainer: { 
    flexDirection: "row", 
    width: "100%", 
    height: "100%", 
    justifyContent: "space-evenly", 
    alignItems: "center" 
  },
  optionButton: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    height: "100%" 
  },
  iconCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: "#FFFFFF", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 10, 
    ...Shadows.card 
  },
  optionText: { 
    fontFamily: Fonts.semiBold, 
    color: Colors.light.text, 
    fontSize: 14 
  },
  divider: { 
    width: 1, 
    height: 80, 
    backgroundColor: "#EAEAEF" 
  },
});