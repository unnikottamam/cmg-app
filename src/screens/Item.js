import * as React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Text, Title } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width: screenWidth } = Dimensions.get("window");
export default class Item extends React.PureComponent {
  render() {
    const { product, horizontal, colors, navigation, offers, views } =
      this.props;
    let imageUrl = "";
    if (product.images[0].src) {
      const src = product.images[0].src;
      let dot = src.lastIndexOf(".");
      imageUrl = src.substring(0, dot) + "-352x352" + src.substring(dot);
    }
    let leadCount = product.meta_data.find((o) => o.key === "lead_count");

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ProductDetails", {
            prodId: product.id,
          })
        }
        style={{
          marginTop: horizontal ? 10 : 20,
          paddingLeft: horizontal ? 20 : 115,
          maxWidth: horizontal ? 200 : screenWidth,
          ...styles.prodBox,
        }}
      >
        {product.images[0].src && (
          <Image
            style={{
              backgroundColor: colors.grey,
              marginBottom: horizontal ? 10 : 0,
              width: horizontal ? 180 : 80,
              height: horizontal ? 180 : 80,
              left: horizontal ? 0 : 20,
              position: horizontal ? "relative" : "absolute",
              ...styles.prodImg,
            }}
            source={{
              uri: imageUrl,
            }}
          />
        )}

        <Title
          style={{
            color: horizontal ? colors.text : colors.primary,
            ...styles.prodTitle,
          }}
        >
          {product.name.replace(/&amp;/g, "&")}
        </Title>
        {product.price ? (
          <Text style={styles.prodPrice}>Price: CAD ${product.price}</Text>
        ) : null}
        <View style={styles.prodInfo}>
          <Text style={styles.prodCat}>
            <AntDesign name="paperclip" size={14} />{" "}
            {product.categories[0].name.replace(/&amp;/g, "&")}
          </Text>
          <Text
            style={{
              color: colors.error,
              ...styles.prodSku,
            }}
          >
            <AntDesign name="Safety" size={14} /> SKU: {product.sku}
          </Text>
          {(offers || views) && (
            <View
              style={{
                backgroundColor: colors.surface,
                paddingVertical: 5,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: 5,
                borderColor: colors.primaryShadow,
              }}
            >
              {views && (
                <Text
                  style={{
                    ...styles.prodSku,
                  }}
                >
                  <AntDesign name="eyeo" color={colors.primary} size={14} />{" "}
                  Views: 10
                </Text>
              )}
              {offers && leadCount && (
                <Text
                  style={{
                    ...styles.prodSku,
                  }}
                >
                  <AntDesign name="staro" color={colors.primary} size={14} />{" "}
                  Offers: {leadCount.value ? leadCount.value : 0}
                </Text>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  prodBox: {
    paddingRight: 20,
    minHeight: 80,
    flex: 1,
    alignItems: "flex-start",
    overflow: "hidden",
  },
  prodImg: {
    borderRadius: 3,
    top: 0,
  },
  prodTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 0,
    lineHeight: 18,
  },
  prodPrice: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 5,
  },
  prodInfo: {
    flex: 1,
    flexWrap: "wrap",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  prodBtns: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  prodSku: {
    fontWeight: "500",
  },
});
