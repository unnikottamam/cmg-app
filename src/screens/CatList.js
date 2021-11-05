import * as React from "react";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const MyLoader = (props) => (
  <ContentLoader
    speed={1.5}
    width={320}
    height={45}
    viewBox="0 0 320 45"
    backgroundColor="#ccc"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Circle x="25" y="5" cx="10" cy="20" r="8" />
    <Rect x="65" y="20" rx="5" ry="5" width="220" height="10" />
  </ContentLoader>
);

export default function CatList() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const catList = `https://coastmachinery.com/wp-json/wp/v3/cats/`;

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
    <ScrollView>
      {isLoading ? (
        <>
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
          <MyLoader />
        </>
      ) : (
        <>
          <List.Section>
            {data
              .reverse()
              .filter((item) => item.parent == 0)
              .map((cat) => (
                <List.Accordion
                  key={uuidv4()}
                  title={cat.title
                    .replace(/machines/gi, "")
                    .replace(/used/gi, "")
                    .replace(/&amp;/g, "&")
                    .replace(/ and /gi, " & ")
                    .trim()}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      color={colors.accent}
                      icon="checkbox-multiple-marked-circle-outline"
                    />
                  )}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: colors.primary,
                    paddingVertical: 0,
                  }}
                  titleStyle={{
                    fontWeight: "500",
                    letterSpacing: 0.25,
                  }}
                >
                  {data
                    .filter((item) => item.parent == cat.id)
                    .reverse()
                    .map((subcat) => (
                      <List.Item
                        key={uuidv4()}
                        onPress={() =>
                          navigation.navigate("CatDetails", {
                            cat: subcat.id,
                            title: subcat.title,
                          })
                        }
                        title={subcat.title
                          .replace(/machines/gi, "")
                          .replace(/used/gi, "")
                          .replace(/&amp;/g, "&")
                          .replace(/ and /gi, " & ")
                          .trim()}
                      />
                    ))}
                </List.Accordion>
              ))}
          </List.Section>
        </>
      )}
    </ScrollView>
  );
}
