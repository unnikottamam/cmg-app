import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Background from "../shared/Background";

export default function Loading() {
  const { colors } = useTheme();

  return (
    <Background style={styles.container}>
      <ActivityIndicator animating={true} color={colors.primary} />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
