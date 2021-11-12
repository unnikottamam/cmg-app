import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

// Create the Auth Context with the data type specified
// and a empty object
const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem("@AuthData");
      if (authDataSerialized) {
        const _authData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
      setAuthData(undefined);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email, password) => {
    const _authData = await authService.signIn(email, password);
    if (_authData.token) {
      _authData.password = password;
      setAuthData(_authData);
      AsyncStorage.setItem("@AuthData", JSON.stringify(_authData));
      return true;
    } else {
      setAuthData(undefined);
      await AsyncStorage.removeItem("@AuthData");
      return false;
    }
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem("@AuthData");
  };

  return (
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
