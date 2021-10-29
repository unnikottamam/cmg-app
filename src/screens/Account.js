import * as React from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddProduct from "./AddProduct";
import CatDetails from "./CatDetails";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import Login from "./Login";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

const AccountTab = createMaterialTopTabNavigator();

const Account = ({ token }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isLogged, setIsLogged] = React.useState(false);

  const dispatch = useDispatch();
  console.log(token);
  React.useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        setIsLogged(false);
        return;
      }
      const transformedData = JSON.parse(userData);
      try {
        dispatch(authActions.authenticate(transformedData));
        setIsLogged(true);
      } catch (err) {
        setIsLogged(false);
      }
    };
    tryLogin();
  }, [dispatch]);

  return isLogged ? (
    <AccountTab.Navigator>
      <AccountTab.Group>
        <AccountTab.Screen
          name="Products"
          options={{ title: "My Products" }}
          component={CatDetails}
        />
        <AccountTab.Screen name="Add Product" component={AddProduct} />
      </AccountTab.Group>
    </AccountTab.Navigator>
  ) : (
    <KeyboardAvoidingView
      keyboardVerticalOffset={160}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
        <Login />
        <Divider
          style={{ backgroundColor: colors.primary, ...styles.divider }}
        />
        <Button
          mode="contained"
          color={colors.primary}
          icon={() => <AntDesign name="adduser" color="white" size={18} />}
          style={{
            borderColor: colors.surface,
            ...styles.button,
          }}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLbl}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
});
export default connect(mapStateToProps)(Account);

const styles = StyleSheet.create({
  scrollView: {
    padding: 30,
  },
  buttonContent: {
    height: 50,
  },
  buttonLbl: {
    fontWeight: "700",
  },
  button: {
    borderWidth: 2,
  },
  divider: {
    marginVertical: 25,
  },
});
