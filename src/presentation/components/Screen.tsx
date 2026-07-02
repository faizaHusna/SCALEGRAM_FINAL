import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/core/theme/colors";

interface ScreenProps {
  children: ReactNode;
}

export default function Screen({
  children,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:Colors.light.background,
  },

  content:{
    flexGrow:1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  }

});