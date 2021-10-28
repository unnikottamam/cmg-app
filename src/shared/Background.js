import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";

export default function Background({ style, ...rest }) {
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.background }, style]} {...rest} />
  );
}
