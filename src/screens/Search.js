import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Searchbar, Text, useTheme } from "react-native-paper";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import MainTitle from "../components/MainTitle";
import ProductList from "./ProductList";
import Item from "./Item";
import { useNavigation } from "@react-navigation/native";

export default function Search() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(true);
  const [shouldFetch, setShouldFetch] = React.useState(true);

  const fetchMore = React.useCallback(() => setShouldFetch(true), []);
  React.useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    fetch(
      `https://coastmachinery.com/wp-json/wc/v2/products?in_stock=true&search=${searchQuery}&page=${page}&per_page=7&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`
    )
      .then((response) => response.json())
      .then((json) => {
        setShouldFetch(false);
        setData((data) => [...data, ...json]);
        setPage(page + 1);
      })
      .catch()
      .finally(() => setLoading(false));
  }, [searchQuery, page, shouldFetch]);

  const renderItem = ({ item }) => (
    <Item navigation={navigation} product={item} colors={colors} />
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <View style={styles.searchView}>
        <Searchbar
          placeholder="Search here ..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{
            borderColor: colors.primary,
            shadowColor: colors.primaryShadow,
            ...styles.searchBar,
          }}
        />
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : searchQuery.length > 1 ? (
        <>
          <MainTitle noPaddingTop title={"Searching: " + searchQuery} />
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id.toString().concat(index.toString())
            }
            onEndReachedThreshold={0.95}
            onEndReached={fetchMore}
            showsVerticalScrollIndicator={false}
            initialNumToRender={7}
          />
        </>
      ) : (
        <ScrollView>
          <MainTitle title="Top Categories" hasButton />
          <View style={styles.topCatList}>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              CNC Equipment
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              Shapers
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              Compressors
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              Edgebanders
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              Sliding Saws
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="outlined"
            >
              Sanders
            </Button>
            <Button
              style={styles.listBtn}
              labelStyle={styles.listBtnLbl}
              color={colors.text}
              mode="text"
              icon="plus"
            >
              More
            </Button>
          </View>
          <Divider />
          <ProductList horizontal title="Latest Products" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchView: {
    padding: 15,
  },
  searchBar: {
    borderRadius: 30,
    elevation: 26,
    borderWidth: 2,
    shadowOffset: {
      height: 15,
    },
  },
  topCatList: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listBtn: {
    borderRadius: 25,
    marginRight: 3,
    marginBottom: 5,
  },
  listBtnLbl: {
    fontSize: 13,
    letterSpacing: 0,
  },
  topCatbtnLbl: {
    letterSpacing: 0.2,
    paddingHorizontal: 3,
  },
});
