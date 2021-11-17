import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Snackbar,
  Text,
  Title,
  useTheme,
  Card,
} from "react-native-paper";
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ContactForm from "./ContactForm";
import ProductList from "./ProductList";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "../contexts/Auth";
import { WEB_URL } from "../config";

const { width: screenWidth } = Dimensions.get("window");
export default function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [bannerImg, setBannerImg] = React.useState(
    `${WEB_URL}/wp-content/uploads/2021/11/App-Banner.png`
  );
  const [bannerLink, setBannerLink] = React.useState("");
  const [bannerURL, setBannerURL] = React.useState("");
  const [bannerTitle, setBannerTitle] = React.useState("");
  const [formTitle, setFormTitle] = React.useState("Contact Us");
  const [visible, setVisible] = React.useState(false);
  const showModal = (title) => {
    setVisible(true);
    setFormTitle(title);
  };
  const hideModal = () => setVisible(false);

  const [errVisible, setErrVisible] = React.useState(false);
  const [formOutput, setFormOutput] = React.useState("");
  const onDismissSnackBar = () => setErrVisible(false);
  const handleContactForm = (data) => {
    setVisible(false);
    setErrVisible(true);
    setFormOutput(data.message);
  };

  const { authData } = useAuth();

  React.useEffect(() => {
    fetch(`${WEB_URL}/wp-json/wp/v3/homescreen`)
      .then((response) => response.json())
      .then((json) => {
        setBannerTitle(json.title);
        setBannerImg(json.src);
        if (json.link_exists) {
          setBannerLink(json.linktitle);
          setBannerURL(json.url);
        }
      })
      .catch();
  }, []);

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Card.Cover
            style={{ height: screenWidth * (6 / 16) }}
            resizeMode="cover"
            source={{ uri: bannerImg }}
          />
          <Card.Content
            style={{
              paddingTop: 18,
              paddingHorizontal: 20,
            }}
          >
            <Title
              style={{
                fontSize: 14,
                lineHeight: 16,
                color: colors.placeholder,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              {bannerTitle}
            </Title>
          </Card.Content>
          <Card.Actions
            style={{
              paddingHorizontal: 20,
              paddingBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {bannerLink && bannerURL ? (
              <Button
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 30,
                  marginRight: 8,
                  marginTop: 8,
                }}
                contentStyle={{ paddingHorizontal: 8 }}
                uppercase={false}
                color={colors.primary}
                mode="outlined"
                icon="call-made"
                onPress={() => WebBrowser.openBrowserAsync(bannerURL)}
              >
                {bannerLink}
              </Button>
            ) : null}
            <Button
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 30,
                marginTop: 8,
              }}
              contentStyle={{ paddingHorizontal: 8 }}
              uppercase={false}
              color={colors.primary}
              mode="outlined"
              onPress={() => navigation.navigate("Categories")}
            >
              See All Categories
            </Button>
          </Card.Actions>
        </Card>

        <View style={styles.topCatBox}>
          {!authData && (
            <View
              style={{
                marginBottom: 15,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.primaryShadow,
                backgroundColor: colors.surface,
                borderRadius: 15,
              }}
            >
              <Title
                style={{
                  fontSize: 14,
                  lineHeight: 15,
                  color: colors.placeholder,
                }}
              >
                List Your Machines with
              </Title>
              <Title
                style={{
                  fontSize: 16,
                  lineHeight: 17,
                  paddingBottom: 5,
                  fontWeight: "800",
                  color: colors.primary,
                }}
              >
                Coast Machinery Group.
              </Title>
              <Text
                style={{
                  marginBottom: 2,
                }}
              >
                <MaterialCommunityIcons
                  name="google-analytics"
                  color={colors.primary}
                  size={15}
                />{" "}
                35,000+ Website Visitors / Month
              </Text>
              <Text
                style={{
                  marginBottom: 2,
                }}
              >
                <MaterialCommunityIcons
                  name="google"
                  color={colors.primary}
                  size={15}
                />{" "}
                Get Top Search Results On Google
              </Text>
              <Text
                style={{
                  marginBottom: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="email-open-multiple-outline"
                  color={colors.primary}
                  size={15}
                />{" "}
                50,000+ Newsletter Subscribers
              </Text>
              <Text
                style={{
                  marginBottom: 2,
                }}
              >
                <MaterialCommunityIcons
                  name="monitor-dashboard"
                  color={colors.primary}
                  size={15}
                />{" "}
                Your Own Products Dashboard
              </Text>
              <Button
                style={{
                  borderWidth: 1,
                  borderColor: colors.primaryShadow,
                  borderRadius: 30,
                  marginTop: 8,
                }}
                labelStyle={{
                  letterSpacing: 0,
                  paddingVertical: 3,
                  fontWeight: "700",
                }}
                uppercase={false}
                color={colors.primary}
                mode="outlined"
                icon="account-plus-outline"
                onPress={() => navigation.navigate("Register")}
              >
                Register As a Vendor
              </Button>
            </View>
          )}
          <View style={styles.topCatbtns}>
            <Button
              mode="outlined"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                ...styles.topCatContact,
              }}
              labelStyle={styles.topCatbtnLbl}
              icon="email-outline"
              onPress={() => showModal("Contact Us")}
            >
              Contact
            </Button>
            <Button
              mode="outlined"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                ...styles.topCatPhone,
              }}
              labelStyle={styles.topCatbtnLbl}
              icon="phone-outline"
              onPress={() => Linking.openURL("tel://+16045562225")}
            >
              Call Us
            </Button>
          </View>
        </View>
        <Divider />
        <ProductList title="Woodworking Machines" cat={361} />
        <Divider />
        <ProductList title="Metalworking Machines" cat={377} />
        <Divider />
        <ProductList title="Stone & Glass Machines" cat={380} />
        <Divider />
        <ProductList title="Warehousing Machines" cat={382} />
      </ScrollView>
      <Portal>
        <Snackbar
          visible={errVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
          }}
        >
          {formOutput}
        </Snackbar>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: colors.surface,
            ...styles.modal,
          }}
        >
          <ScrollView>
            <ContactForm
              onFormSubmit={handleContactForm}
              title={formTitle}
              lookingfor="App Home Screen"
            />
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
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topCatBox: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topCatbtns: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  topCatContact: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  topCatPhone: {
    flex: 1,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  topCatbtnLbl: {
    letterSpacing: 0.2,
    paddingHorizontal: 3,
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
});
