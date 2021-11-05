import * as React from "react";
import { useTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import CatScreen from "./CatScreen";

export default function CatDetails(props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <CatScreen
      {...props}
      colors={colors}
      route={route}
      navigation={navigation}
    />
  );
}
