import * as React from "react";
import { FlatList, ScrollView, View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { v4 as uuidv4 } from "uuid";
import { WEB_URL } from "../config";
import ProductWrap from "./ProductWrap";
import { useAuth } from "../contexts/Auth";
import { Button, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

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

const renderItem = ({ item }) => <ProductWrap product={item} />;
export default function MyProducts() {
  const [isLoading, setLoading] = React.useState(true);
  const [isProducts, setIsProducts] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { authData } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (authData && isLoading)
      fetch(`${WEB_URL}/wp-json/wp/v3/prodauth/?id=${authData.userid}`)
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          setIsProducts(() => (json ? true : false));
        })
        .catch()
        .finally(() => setLoading(false));
  }, []);

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
  ) : isProducts ? (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={() => uuidv4()}
      onEndReachedThreshold={0.75}
      showsVerticalScrollIndicator={false}
      initialNumToRender={7}
    />
  ) : (
    <View
      style={{
        padding: 30,
        alignItems: "flex-start",
      }}
    >
      <Title
        style={{
          fontSize: 16,
          lineHeight: 18,
          marginBottom: 10,
        }}
      >
        You didn't list any machines yet. Add products to your account
      </Title>
      <Button
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("AddMyProduct")}
      >
        Add Product
      </Button>
    </View>
  );
}
