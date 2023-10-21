import { createContext } from "react";

export interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn(loggedIn: boolean): void;
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  setLoggedIn() {},
});
