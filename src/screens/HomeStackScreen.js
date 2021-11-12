import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Button, useTheme } from "react-native-paper";
import CatList from "./CatList";
import Search from "./Search";
import Account from "./Account";
import Home from "./Home";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/Auth";

function HomeScreen() {
  return <Home />;
}

function SearchScreen() {
  return <Search />;
}

function CategoryScreen() {
  return <CatList />;
}

function AccountScreen() {
  return <Account />;
}

const Tab = createBottomTabNavigator();

export default function HomeStackScreen() {
  const { colors } = useTheme();
  const { authData } = useAuth();
  const auth = useAuth();

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <Tab.Navigator
      shifting={false}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    ...styles.activeBorder,
                  }}
                />
              )}
              <AntDesign name="home" color={color} size={23} />
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    ...styles.activeBorder,
                  }}
                />
              )}
              <AntDesign name="search1" color={color} size={23} />
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    ...styles.activeBorder,
                  }}
                />
              )}
              <AntDesign name="bars" color={color} size={23} />
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={AccountScreen}
        options={{
          title: authData ? "Dashboard" : "Account",
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    ...styles.activeBorder,
                  }}
                />
              )}
              <AntDesign name="user" color={color} size={23} />
            </>
          ),
          headerRight: () =>
            authData ? <Button onPress={logout}>Logout</Button> : null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeBorder: {
    height: 2,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: "absolute",
    left: "8%",
    top: 0,
    width: "84%",
  },
});
