import * as React from "react";
import {
  Button,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Linking, useColorScheme } from "react-native";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStackScreen from "./src/screens/HomeStackScreen";
import Loading from "./src/screens/Loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProductDetails from "./src/screens/ProductDetail";
import CatDetails from "./src/screens/CatDetails";
import Register from "./src/screens/Register";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import authReducer from "./src/store/reducers/auth";

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  roundness: 0,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: "#5851D8",
    accent: "#833AB4",
    solidColor: "#111",
    placeholder: "rgba(0, 0, 0, 0.8)",
    grey: "rgba(0, 0, 0, 0.08)",
    greyLight: "rgba(0, 0, 0, 0.03)",
    inputColor: "rgba(0, 0, 0, 0.8)",
    backdrop: "rgba(0, 0, 0, 0.8)",
    primaryShadow: "rgba(88, 81, 216, 0.4)",
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  roundness: 0,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: "#E1306C",
    accent: "#C13584",
    solidColor: "#fff",
    placeholder: "rgba(255, 255, 255, 0.8)",
    grey: "rgba(255, 255, 255, 0.08)",
    greyLight: "rgba(255, 255, 255, 0.03)",
    inputColor: "rgba(255, 255, 255, 0.8)",
    backdrop: "rgba(0, 0, 0, 0.88)",
    primaryShadow: "rgba(225, 48, 108, 0.6)",
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme} fallback={<Loading />}>
            <Stack.Navigator>
              <Stack.Screen
                name="CMG"
                component={HomeStackScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProductDetails"
                options={{
                  title: "",
                  headerRight: () => (
                    <Button
                      icon="phone"
                      uppercase={false}
                      labelStyle={{ fontWeight: "700" }}
                      onPress={() => Linking.openURL("tel://+16045562225")}
                    >
                      Call Us
                    </Button>
                  ),
                }}
                component={ProductDetails}
              />
              <Stack.Screen
                name="CatDetails"
                options={({ route }) => ({
                  title: route.params.title
                    .replace(/used/gi, "")
                    .replace(/&amp;/g, "&")
                    .replace(/ and /gi, " & "),
                })}
                component={CatDetails}
              />
              <Stack.Screen
                name="Register"
                options={{
                  title: "Vendor Registration",
                }}
                component={Register}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
