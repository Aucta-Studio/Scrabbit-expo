import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Post from "../Components/Post";

export default () => {
  return (
      <SafeAreaView style={styles.page}>
          <Text style={styles.tex}>This is My scrapbooks page</Text>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create(
  {
    page:{
      backgroundColor: "#000"
    },
    tex:{
      color: "#FFF"
    }
  }
);