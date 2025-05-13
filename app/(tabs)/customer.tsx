import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Customer Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d63384",
  },
});
