import * as React from "react";

const AuthContext = React.createContext();

export default function useAuth() {
  return useContext(AuthContext);
}
