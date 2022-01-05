import * as React from "react";
import {
  Button,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Linking, Platform } from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStackScreen from "./src/screens/HomeStackScreen";
import Loading from "./src/screens/Loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProductDetails from "./src/screens/ProductDetail";
import CatDetails from "./src/screens/CatDetails";
import Register from "./src/screens/Register";
import { AuthProvider, useAuth } from "./src/contexts/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

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
    greyDark: "rgba(0, 0, 0, 0.20)",
    greyLight: "rgba(0, 0, 0, 0.03)",
    inputColor: "rgba(0, 0, 0, 0.8)",
    backdrop: "rgba(0, 0, 0, 0.8)",
    primaryShadow: "rgba(88, 81, 216, 0.4)",
  },
};

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

export default function App() {
  const theme = CombinedDefaultTheme;
  const { authData } = useAuth();
  const [pushToken, setPushToken] = React.useState();

  React.useEffect(async () => {
    try {
      const deviceToken = await AsyncStorage.getItem("@deviceToken");
      if (!deviceToken) {
        let token;
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        if (token) {
          setPushToken(token);
          await AsyncStorage.setItem("@deviceToken", token);
          const tokenRes = await fetch(
            "https://app-data-d898a-default-rtdb.firebaseio.com/pushtokens.json?apiKey=AIzaSyAH-o1jtTEdfU9KAnztrN_cm81RAetUxlo",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                deviceToken: token,
              }),
            }
          );
        }
      }
    } catch (error) {
      setPushToken(undefined);
    }
  }, []);

  React.useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {});

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
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
                    .replace(/machines/gi, "")
                    .replace(/used/gi, "")
                    .replace(/&amp;/g, "&")
                    .replace(/ and /gi, " & "),
                })}
                component={CatDetails}
              />
              {!authData && (
                <Stack.Screen
                  name="Register"
                  options={() => ({
                    animation: Platform.OS === "ios" ? "default" : "none",
                    title: "Vendor Registration",
                  })}
                  component={Register}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
