import React, { useContext, useState } from "react";
import jwt from "jsonwebtoken";
import { Option, None, Some } from "ts-results";

/**
 * @types are the only ones that needs to be declared
 * when initializing data
 */
export type AuthService = {
  auth: boolean;
  authUserData: Option<{
    userId: string;
    fname: string;
    lname: string;
  }>;
  authToken: Option<string>;
  authenticateUser: (token: string) => void;
  logoutUser: () => void;
};

// default values
export const AuthContext = React.createContext<AuthService>({
  auth: false,
  authUserData: None,
  authToken: None,
  authenticateUser: (token: string) => {},
  logoutUser: () => {},
});

//
export const useAuthContext = () => useContext(AuthContext);

function getAuthToken(): Option<string> {
  let token = localStorage.getItem("auth");
  if (token) return Some(token);
  return None;
}

type UserInfo = {
  userId: string;
  fname: string;
  lname: string;
};

function getSessionData(): [Option<UserInfo>, Option<string>, boolean] {
  let authToken = getAuthToken();
  if (authToken.some) {
    const decode: { [key: string]: any } | string | null = jwt.decode(
      authToken.val
    );
    if (typeof decode === "object" && decode) {
      console.log("decode", decode);
      return [
        Some({
          userId: decode.id,
          fname: decode.fname,
          lname: decode.lname,
        }),
        Some(authToken.val),
        true,
      ];
    }
  }
  return [None, None, false];
}

async function decodeAuthToken(token: string): Promise<Option<UserInfo>> {
  const decode: { [key: string]: any } | string | null = jwt.decode(token);
  if (typeof decode === "object" && decode) {
    return Some({
      userId: decode.id,
      fname: decode.fname,
      lname: decode.lname,
    });
  }
  return None;
}

function clearAllStorage() {
  localStorage.removeItem("auth");
}

//
const AuthServiceProvider = (props: { children: object }) => {
  const session = getSessionData();
  const isAuth = session[2];
  const userInfo = session[0];
  const sessionToken = session[1];

  const [authUserData, setAuthUserData] = useState<Option<UserInfo>>(userInfo);
  const [auth, setAuth] = useState<boolean>(isAuth);
  const [authToken, setAuthToken] = useState<Option<string>>(sessionToken);
  //
  const authenticateUser = async (token: string) => {
    setAuthToken(Some(token));
    let decodeToken = await decodeAuthToken(token);
    console.log("decodeToken", decodeToken);
    setAuthUserData(decodeToken);
    setAuth(true);
  };
  //
  const logoutUser = () => {
    setAuth(false);
    clearAllStorage();
    setAuthUserData(None);
    setAuthToken(None);
  };
  //
  return (
    <AuthContext.Provider
      value={{
        auth,
        authUserData,
        authToken,
        authenticateUser,
        logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

//
export default AuthServiceProvider;
