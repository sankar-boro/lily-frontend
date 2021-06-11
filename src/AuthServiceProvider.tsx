import React, { useContext, useState } from "react";

/**
 * @types are the only ones that needs to be declared
 * when initializing data
 */
export type AuthService = {
  auth: boolean;
  authenticateUser: () => void;
  logoutUser: () => void;
};

// default values
export const AuthContext = React.createContext<AuthService>({
  auth: false,
  authenticateUser: () => {},
  logoutUser: () => {},
});

//
export const useAuthContext = () => useContext(AuthContext);

//
function isAuthUser() {
  if (localStorage.getItem("auth")) {
    return true;
  }
  return false;
}

//
const AuthServiceProvider = (props: { children: object }) => {
  const _isauthUser = isAuthUser();
  const [auth, setAuth] = useState(_isauthUser);
  //
  const authenticateUser = () => {
    setAuth(true);
  };
  //
  const logoutUser = () => {
    setAuth(false);
  };
  //
  return (
    <AuthContext.Provider
      value={{
        auth,
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
