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
import { useAuth } from "../contexts/Auth";
import { WEB_URL } from "../config";

const { width: screenWidth } = Dimensions.get("window");
export default function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [bannerImg, setBannerImg] = React.useState(
    `${WEB_URL}/wp-content/uploads/2021/11/App-Banner.png`
  );
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
        setBannerImg(json.src);
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
          <Card.Actions
            style={{
              paddingHorizontal: 20,
              paddingBottom: 18,
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
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
              onPress={() => Linking.openURL("tel://+16045562225")}
            >
              Call
            </Button>
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
              onPress={() => navigation.navigate("Categories")}
            >
              All Categories
            </Button>
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
              onPress={() => showModal("Contact Us")}
            >
              Email
            </Button>
          </Card.Actions>
        </Card>
        {!authData && (
          <View style={styles.topCatBox}>
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor: colors.primaryShadow,
                backgroundColor: colors.surface,
                borderRadius: 15,
              }}
            >
              <Title
                style={{
                  fontSize: 15,
                  lineHeight: 16,
                  paddingBottom: 5,
                  fontWeight: "800",
                  color: colors.primary,
                }}
              >
                List Your Machines with us !
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
                High Volume Website Traffic
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
                Top Search Engine Results
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
                High Volume Email - SMS Advertising
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
                Account access to your product activity and sales
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
          </View>
        )}
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
    paddingTop: 20,
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
