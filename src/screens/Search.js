import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import MainTitle from "../components/MainTitle";
import Item from "./Item";
import { useNavigation } from "@react-navigation/native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { v4 as uuidv4 } from "uuid";
import { WEB_URL } from "../config";

const MyLoader = (props) => (
  <ContentLoader
    speed={3}
    width={320}
    height={80}
    viewBox="0 0 320 80"
    backgroundColor="#ccc"
    foregroundColor="#ecebeb"
    animate={true}
    speed={0.7}
    {...props}
    style={{
      marginTop: 20,
    }}
  >
    <Rect x="115" y="6" rx="3" ry="3" width="175" height="8" />
    <Rect x="115" y="24" rx="3" ry="3" width="120" height="4" />
    <Rect x="115" y="34" rx="3" ry="3" width="100" height="6" />
    <Rect x="20" y="0" rx="3" ry="3" width="80" height="80" />
  </ContentLoader>
);
export default function Search() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searched, setSearched] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [searchData, setSearchData] = React.useState([]);
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setSearchPage(1);
    setSearchData([]);
  };

  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(true);
  const [shouldFetch, setShouldFetch] = React.useState(true);
  const [searchPage, setSearchPage] = React.useState(1);
  const [isSearchLoading, setSearchLoading] = React.useState(true);
  const [searchShouldFetch, setSearchShouldFetch] = React.useState(true);

  const fetchMore = React.useCallback(() => setShouldFetch(true), []);
  const searchFetchMore = React.useCallback(
    () => setSearchShouldFetch(true),
    []
  );
  let fetchURL = `${WEB_URL}/wp-json/wc/v2/products?in_stock=true&per_page=7&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`;

  React.useEffect(() => {
    if (!shouldFetch || page > 3) {
      return;
    }
    fetch(`${fetchURL}&page=${page}`)
      .then((response) => response.json())
      .then((json) => {
        setShouldFetch(false);
        setData((data) => [...data, ...json]);
        setPage(page + 1);
      })
      .catch()
      .finally(() => setLoading(false));
  }, [page, shouldFetch]);

  React.useEffect(() => {
    if (!searchShouldFetch) {
      return;
    }
    onHandleSearch();
  }, [searchPage, searchShouldFetch]);

  const onHandleSearch = () => {
    if (searchQuery.length < 1) {
      setSearched(false);
      setSearchLoading(true);
      return;
    }
    if (searchPage === 1) setSearchLoading(true);
    setSearched(true);
    fetch(`${fetchURL}&search=${searchQuery}&page=${searchPage}`)
      .then((response) => response.json())
      .then((json) => {
        setSearchShouldFetch(false);
        setSearchData((data) => [...data, ...json]);
        setSearchPage(searchPage + 1);
      })
      .catch()
      .finally(() => setSearchLoading(false));
  };

  const onSearchClear = () => {
    setSearched(false);
    setSearchLoading(true);
    setSearchPage(1);
    setSearchQuery("");
    setSearchData([]);
  };

  const renderItem = ({ item }) => (
    <Item navigation={navigation} product={item} colors={colors} />
  );

  return (
    <SafeAreaView>
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
          onSubmitEditing={onHandleSearch}
          clearIcon={() => <IconButton icon="close" onPress={onSearchClear} />}
        />
      </View>
      {isLoading ? (
        <ScrollView>
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
        </ScrollView>
      ) : searched && isSearchLoading ? (
        <ActivityIndicator
          style={{ marginTop: 15 }}
          animating={true}
          color={colors.primary}
        />
      ) : (
        <View style={{ paddingBottom: 182 }}>
          {searchData.length === 0 && searched ? (
            <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  maxWidth: 290,
                }}
              >
                Search your keyword. If keyword not found, See our machine
                categories
              </Text>
              <Button
                mode="outlined"
                uppercase={false}
                style={{
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
                onPress={() => navigation.navigate("Categories")}
              >
                See All Categories
              </Button>
            </View>
          ) : (
            <MainTitle
              noPaddingTop
              title={searched ? "Searching: " + searchQuery : "Latest Products"}
            />
          )}
          <FlatList
            data={searched ? searchData : data}
            renderItem={renderItem}
            keyExtractor={() => uuidv4()}
            onEndReachedThreshold={0.75}
            onEndReached={searched ? searchFetchMore : fetchMore}
            showsVerticalScrollIndicator={false}
            initialNumToRender={7}
            ListFooterComponent={() =>
              searchData.length === 0 && searched ? null : (
                <Button
                  mode="contained"
                  uppercase={false}
                  style={{ borderRadius: 25, margin: 20, marginBottom: 50 }}
                  contentStyle={{ padding: 5 }}
                  onPress={() => navigation.navigate("Categories")}
                >
                  See All Categories
                </Button>
              )
            }
          />
        </View>
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
