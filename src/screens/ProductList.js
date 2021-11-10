import * as React from "react";
import { Button, useTheme } from "react-native-paper";
import { FlatList, StyleSheet } from "react-native";
import MainTitle from "../components/MainTitle";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { WEB_URL, WOO_KEY, WOO_SECRET } from "../config";
import ProductWrap from "./ProductWrap";

const renderItem = ({ item }) => (
  <ProductWrap product={item} horizontal={true} />
);

export default function ProductList({ title, cat }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const category = cat ? `&category=${cat}` : "";

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
      onPress={() => navigation.navigate("Categories")}
    >
      See All
    </Button>
  );

  React.useEffect(() => {
    fetch(
      `${WEB_URL}/wp-json/wc/v2/products?in_stock=true&page=1&per_page=8&status=publish&consumer_key=${WOO_KEY}&consumer_secret=${WOO_SECRET}${category}`
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
        keyExtractor={() => uuidv4()}
        horizontal={true}
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
