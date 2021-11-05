import * as React from "react";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Item from "./Item";

export default function ProductWrap(props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return <Item {...props} colors={colors} navigation={navigation} />;
}
