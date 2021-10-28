import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import MainTitle from "../components/MainTitle";
import ContactForm from "./ContactForm";
import ProductList from "./ProductList";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isLoading, setLoading] = React.useState(true);

  const [formTitle, setFormTitle] = React.useState("Contact Us");
  const [visible, setVisible] = React.useState(false);
  const showModal = (title) => {
    setVisible(true);
    setFormTitle(title);
  };
  const hideModal = () => setVisible(false);

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      {!isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ProductList horizontal title="Latest Products" />
            <Divider />
            <MainTitle title="Top Categories" hasButton />
            <View style={styles.topCatBox}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.topCatList}
              >
                <Button
                  style={styles.listBtn}
                  labelStyle={styles.listBtnLbl}
                  color={colors.text}
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("CatDetails", {
                      title: "CNC Equipment",
                    })
                  }
                >
                  CNC Equipment
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
                  Shapers
                </Button>
                <Button
                  style={styles.listBtn}
                  labelStyle={styles.listBtnLbl}
                  color={colors.text}
                  mode="outlined"
                >
                  Dust Collectors
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
                  mode="outlined"
                >
                  Planers / Jointers
                </Button>
              </ScrollView>
              <View style={styles.topCatbtns}>
                <Button
                  mode="outlined"
                  style={styles.topCatContact}
                  labelStyle={styles.topCatbtnLbl}
                  icon="email-outline"
                  onPress={() => showModal("Contact Us")}
                >
                  Contact
                </Button>
                <Button
                  mode="outlined"
                  style={styles.topCatPhone}
                  labelStyle={styles.topCatbtnLbl}
                  icon="phone-outline"
                >
                  Call Us
                </Button>
              </View>
            </View>
            <Divider />
            <ProductList horizontal title="Woodworking Machines" cat={361} />
            <Divider />
            <ProductList horizontal title="Metalworking Machines" cat={377} />
          </ScrollView>
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
          </Portal>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topCatBox: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topCatList: {
    paddingTop: 10,
    paddingBottom: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
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
