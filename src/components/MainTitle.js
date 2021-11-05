import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Title, useTheme } from "react-native-paper";

export default function MainTitle({ title, hasButton, noPaddingTop }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: noPaddingTop ? 0 : 20,
        ...styles.titleView,
      }}
    >
      <Title
        style={{
          color: colors.primary,
          ...styles.title,
        }}
      >
        {title}
      </Title>
      {hasButton && (
        <Button
          style={styles.button}
          labelStyle={styles.buttonLbl}
          mode="outlined"
          uppercase={false}
          onPress={() => navigation.navigate("Categories")}
        >
          See All
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 22,
    margin: 0,
  },
  button: {
    borderRadius: 20,
  },
  buttonLbl: {
    fontWeight: "700",
    letterSpacing: 0,
  },
});
