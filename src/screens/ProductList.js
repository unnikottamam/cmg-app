import * as React from "react";
import { Button, useTheme } from "react-native-paper";
import { FlatList, StyleSheet } from "react-native";
import Item from "./Item";
import MainTitle from "../components/MainTitle";
import { useNavigation } from "@react-navigation/native";

export default function ProductList({ title, cat, horizontal }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const category = cat ? `&category=${cat}` : "";

  const renderItem = ({ item }) => (
    <Item
      product={item}
      horizontal={horizontal}
      navigation={navigation}
      colors={colors}
    />
  );
  const footerComponent = isLoading ? null : (
    <Button
      color={colors.primary}
      style={styles.gridFooter}
      labelStyle={styles.gridFooterLbl}
      contentStyle={{
        borderColor: colors.grey,
        ...styles.gridFooterCont,
      }}
      mode="outlined"
      onPress={() =>
        navigation.navigate("CatDetails", {
          title: title,
        })
      }
    >
      See All
    </Button>
  );

  React.useEffect(() => {
    fetch(
      `https://coastmachinery.com/wp-json/wc/v2/products?in_stock=true&page=1&per_page=8&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68${category}`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch()
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {title && !isLoading && <MainTitle title={title} />}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(data) => data.sku}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={footerComponent}
        initialNumToRender={2}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gridFooter: {
    maxWidth: 200,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    height: 200,
    justifyContent: "center",
    borderWidth: 0,
  },
  gridFooterLbl: {
    fontWeight: "800",
  },
  gridFooterCont: {
    height: 180,
    paddingHorizontal: 15,
    borderWidth: 2,
  },
});