import * as React from "react";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Loading from "./screens/Loading";
import CatDetails from "./CatDetails";

const linking = {
  prefixes: ["cmg://"],
  config: {
    screens: {
      HomeScreen: {
        screens: {
          Products: {
            path: "",
            screens: {
              Latest: "latest",
            },
          },
          Account: "account",
        },
      },
    },
  },
};

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  if (state.isLoading) {
    return <Loading />;
  }

  return (
    <AppearanceProvider>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        linking={linking}
        fallback={<Loading />}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="CatDetails" component={CatDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
