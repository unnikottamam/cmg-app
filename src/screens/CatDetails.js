import * as React from "react";
import { FlatList, ScrollView } from "react-native";
import Item from "./Item";
import ContentLoader, { Rect } from "react-content-loader/native";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ReactGA from "react-ga";

ReactGA.initialize("UA-45123217-1");
console.log(ReactGA.pageview("/sell-your-machines-with-coast-machinery-group"));
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

export default function CatDetails({ searchURL }) {
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(true);
  const [shouldFetch, setShouldFetch] = React.useState(true);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const fetchMore = React.useCallback(() => setShouldFetch(true), []);
  React.useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    fetch(
      `https://coastmachinery.com/wp-json/wc/v2/products?in_stock=true&page=${page}&per_page=7&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`
    )
      .then((response) => response.json())
      .then((json) => {
        setShouldFetch(false);
        setData((data) => [...data, ...json]);
        setPage(page + 1);
      })
      .catch()
      .finally(() => setLoading(false));
  }, [page, shouldFetch]);

  const renderItem = ({ item }) => (
    <>
      <Text>
        {ReactGA.pageview("sell-your-machines-with-coast-machinery-group/")}
      </Text>
      <Item navigation={navigation} product={item} colors={colors} />
    </>
  );

  return isLoading ? (
    <ScrollView>
      <MyLoader />
      <MyLoader />
      <MyLoader />
      <MyLoader />
      <MyLoader />
      <MyLoader />
      <MyLoader />
    </ScrollView>
  ) : (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.95}
      onEndReached={fetchMore}
      showsVerticalScrollIndicator={false}
      initialNumToRender={7}
    />
  );
}
