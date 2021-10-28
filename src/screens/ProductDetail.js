import * as React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  DataTable,
  Divider,
  List,
  Modal,
  Portal,
  Surface,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import Carousel, {
  ParallaxImage,
  Pagination,
} from "react-native-snap-carousel";
import { WebView } from "@haskkor/react-native-recaptchav3/node_modules/react-native-webview";
import AntDesign from "react-native-vector-icons/AntDesign";
import ContactForm from "./ContactForm";
import { useRoute } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

export default function ProductDetails() {
  const route = useRoute();
  const { prodId } = route.params;
  const { colors } = useTheme();
  const [isLoading, setLoading] = React.useState(true);
  const [formTitle, setFormTitle] = React.useState("Contact Us");

  const [product, setProduct] = React.useState([]);
  const [youtube, setYoutube] = React.useState();

  const [prodAttr, setProdAttr] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [activeslide, setActiveslide] = React.useState(0);

  const [visible, setVisible] = React.useState(false);
  const showModal = (title) => {
    setVisible(true);
    setFormTitle(title);
  };
  const hideModal = () => setVisible(false);

  const [videoVisible, setVideoVisible] = React.useState(false);
  const showVideoModal = () => setVideoVisible(true);
  const hideVideoModal = () => setVideoVisible(false);

  const productURL = `https://coastmachinery.com/wp-json/wc/v3/products/${prodId}/?consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`;

  const carouselRef = React.useRef(null);
  React.useEffect(() => {
    fetch(productURL)
      .then((response) => response.json())
      .then((json) => {
        setProduct(json);
        if (json.images.length > 0) {
          setImages(json.images);
        }
        let ytId = json.meta_data.find((o) => o.key === "youtube_id");
        ytId.value ? setYoutube(ytId.value) : setYoutube();
        if (json.attributes.length > 1) {
          json.attributes.forEach((attr) => {
            setProdAttr([...prodAttr, attr]);
          });
        }
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }, parallaxProps) => (
    <Surface
      style={{ elevation: images.length > 1 ? 8 : 4, ...styles.carouselItem }}
    >
      <ParallaxImage
        source={{ uri: item.src }}
        parallaxFactor={0.05}
        containerStyle={{
          borderColor: colors.primary,
          backgroundColor: colors.surface,
          ...styles.imageContainer,
        }}
        style={styles.image}
        {...parallaxProps}
      />
    </Surface>
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        ...styles.prodView,
      }}
    >
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        images && (
          <ScrollView>
            <View style={styles.prodInner}>
              <Title
                style={{
                  color: colors.primary,
                  ...styles.prodTitle,
                }}
              >
                {product.name.replace(/&amp;/g, "&")}
              </Title>
              {product.price ? (
                <Text style={styles.prodPrice}>
                  Price: CAD ${product.price}
                </Text>
              ) : null}
              <View style={styles.prodInfo}>
                <Text style={styles.prodCat}>
                  <AntDesign name="paperclip" size={15} />{" "}
                  {product.categories[0].name.replace(/&amp;/g, "&")}
                </Text>
                <Text> | </Text>
                <Text
                  style={{
                    color: colors.error,
                    ...styles.prodSku,
                  }}
                >
                  <AntDesign name="Safety" size={15} /> SKU: {product.sku}
                </Text>
              </View>
              <View style={styles.prodBtns}>
                <Button
                  style={{
                    borderColor: colors.primary,
                    ...styles.prodContact,
                  }}
                  labelStyle={styles.prodTopCont}
                  mode="outlined"
                  onPress={() => showModal("Contact Us")}
                  icon={(props) => <AntDesign {...props} name="message1" />}
                >
                  Contact Us
                </Button>
                {youtube && (
                  <Button
                    mode="text"
                    style={{
                      borderColor: colors.primary,
                      ...styles.prodVideobtn,
                    }}
                    labelStyle={styles.prodTopCont}
                    onPress={showVideoModal}
                    icon="play"
                  >
                    Video
                  </Button>
                )}
              </View>
            </View>
            <Carousel
              ref={carouselRef}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={screenWidth - 60}
              data={images}
              renderItem={renderItem}
              hasParallaxImages={true}
              onSnapToItem={(index) => setActiveslide(index)}
            />
            <Pagination
              carouselRef={carouselRef}
              dotsLength={images.length}
              activeDotIndex={activeslide}
              containerStyle={styles.pagination}
              dotStyle={{
                backgroundColor: colors.primary,
                ...styles.activeDots,
              }}
              inactiveDotStyle={{
                backgroundColor: colors.onSurface,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.65}
              tappableDots={true}
            />
            <View style={styles.prodInner}>
              <List.Section style={styles.section}>
                {product.description ? (
                  <>
                    <List.Accordion
                      style={{
                        backgroundColor: colors.surface,
                        ...styles.accordion,
                      }}
                      title="Product Details"
                      left={(props) => (
                        <AntDesign
                          {...props}
                          style={{ transform: [{ rotateY: "180deg" }] }}
                          name="notification"
                          size={24}
                        />
                      )}
                      id="1"
                    >
                      <WebView
                        style={styles.contentView}
                        scrollEnabled={true}
                        originWhitelist={["*"]}
                        source={{
                          html: `<head>
                          <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                              body {
                                background-color: ${colors.greyLight};
                                margin: 0;
                                padding: 10px 14px;
                                font-size: 14px;
                                line-height: 1.36;
                                box-shadow: inset 0 -3px 12px 0 ${colors.grey};
                              }
                              br {display: none;}
                              p:empty {display: none;}
                              h2, h3, h4, h5, h6, p, ul, ol {margin-bottom: 5px}
                              h5, h6 {font-size: 14px; font-weight: 400}
                            </style>
                          </head>
                          <body>
                            ${product.description.replace(/&nbsp;/g, "")}
                          </body>
                          </html>`,
                        }}
                      />
                    </List.Accordion>
                    <Divider style={{ backgroundColor: colors.primary }} />
                  </>
                ) : null}
                <List.Accordion
                  style={{
                    backgroundColor: colors.surface,
                    ...styles.accordion,
                  }}
                  title="Specifications"
                  id="2"
                >
                  <DataTable.Row>
                    <DataTable.Cell>Weight</DataTable.Cell>
                    <DataTable.Cell>150</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Width</DataTable.Cell>
                    <DataTable.Cell>250</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Length</DataTable.Cell>
                    <DataTable.Cell>215</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Height</DataTable.Cell>
                    <DataTable.Cell>340</DataTable.Cell>
                  </DataTable.Row>
                </List.Accordion>
              </List.Section>
            </View>
            <View style={styles.prodCtas}>
              <Button
                color={colors.primary}
                mode="outlined"
                onPress={() => showModal("Make an Offer")}
                style={styles.offerBtn}
                contentStyle={styles.lgBtnContent}
                labelStyle={styles.lgLabelStyle}
              >
                Make an Offer
              </Button>
              <Button
                color={colors.primary}
                mode="contained"
                onPress={() => showModal("Shipping Quote")}
                style={styles.singleCol}
                contentStyle={styles.lgBtnContent}
                labelStyle={styles.lgLabelStyle}
              >
                Shipping Quote
              </Button>
            </View>
            <View style={styles.prodBottom}>
              <Title
                style={{
                  color: colors.primary,
                  ...styles.titleText,
                }}
              >
                Hear from us ?
              </Title>
              <Text style={styles.paraText}>
                Quas dignissimos laudantium praesentium facilis sed impedit fuga
                sequi ullam non ratione, maiores cumque sapiente?
              </Text>
              <View style={styles.prodBottombtns}>
                <Button style={styles.singleCol} mode="outlined" icon="phone">
                  Call
                </Button>
                <Button style={styles.singleCol} mode="outlined" icon="email">
                  Email
                </Button>
              </View>
            </View>
            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                  backgroundColor: colors.surface,
                  ...styles.modal,
                }}
              >
                <ScrollView>
                  <ContactForm title={formTitle} />
                </ScrollView>
                <Button
                  style={styles.modalClose}
                  color={colors.primary}
                  mode="contained"
                  onPress={hideModal}
                >
                  Close
                </Button>
              </Modal>
              {youtube && (
                <Modal
                  visible={videoVisible}
                  onDismiss={hideVideoModal}
                  contentContainerStyle={styles.videoModal}
                >
                  <Button
                    style={{
                      borderColor: colors.surface,
                      ...styles.videoClose,
                    }}
                    color={colors.primary}
                    mode="contained"
                    onPress={hideVideoModal}
                    icon="close"
                  >
                    Close
                  </Button>
                  <WebView
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{
                      uri: `https://www.youtube.com/embed/${youtube}`,
                    }}
                  />
                </Modal>
              )}
            </Portal>
          </ScrollView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prodView: {
    flex: 1,
  },
  prodInner: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  prodTitle: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "800",
  },
  prodPrice: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  prodInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  prodSku: {
    fontSize: 15,
    fontWeight: "500",
  },
  prodCat: {
    fontSize: 15,
  },
  prodBtns: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  prodContact: {
    borderWidth: 1,
    marginRight: -1,
    marginBottom: -1,
  },
  prodTopCont: {
    fontSize: 13,
  },
  prodVideobtn: {
    borderWidth: 1,
    marginBottom: -1,
  },
  carouselItem: {
    width: screenWidth - 60,
    height: screenWidth - 60,
    marginTop: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    borderWidth: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  pagination: {
    marginTop: -25,
  },
  activeDots: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  section: {
    marginTop: -20,
    marginBottom: 0,
  },
  accordion: {
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  contentView: {
    height: 160,
  },
  lgBtnContent: {
    height: 48,
  },
  lgLabelStyle: {
    fontSize: 13,
  },
  offerBtn: {
    flex: 1,
    borderLeftWidth: 0,
  },
  singleCol: {
    flex: 1,
  },
  prodCtas: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  titleText: {
    fontSize: 20,
    textAlign: "center",
  },
  paraText: {
    textAlign: "center",
  },
  prodBottom: {
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 30,
  },
  prodBottombtns: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  modal: {
    marginHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 10,
  },
  modalClose: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 5,
    shadowOpacity: 0,
    borderWidth: 1,
  },
  videoModal: {
    paddingHorizontal: 10,
    width: screenWidth,
    height: screenWidth * (9 / 16),
  },
  videoClose: {
    position: "absolute",
    right: 10,
    top: -40,
    zIndex: 5,
    shadowOpacity: 0,
    borderWidth: 1,
  },
});
