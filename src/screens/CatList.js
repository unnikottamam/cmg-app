import * as React from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function CatList() {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const renderItem = ({ item }) => (
    <Button
      onPress={() =>
        navigation.navigate("CatDetails", {
          title: item.name,
        })
      }
      mode="outlined"
    >
      {item.name.replace(/&amp;/g, "&")}
    </Button>
  );

  const catList = `https://coastmachinery.com/wp-json/wc/v2/products/categories?per_page=90&exclude=15hide_empty=true&orderby=term_group&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`;

  React.useEffect(() => {
    fetch(catList)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}
