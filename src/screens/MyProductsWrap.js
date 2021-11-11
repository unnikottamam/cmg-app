import * as React from "react";
import { useTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import MyProducts from "./MyProducts";

export default function MyProductsWrap(props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return <MyProducts {...props} colors={colors} navigation={navigation} />;
}
