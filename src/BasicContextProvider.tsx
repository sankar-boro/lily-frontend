import React, { useContext, useState } from "react";

//
export type Basic = {
  auth: boolean;
  authenticateUser: () => void;
  logoutUser: () => void;
};

//
export const BasicContext = React.createContext<Basic>({
  auth: false,
  authenticateUser: () => {},
  logoutUser: () => {},
});

//
export const useBasicContext = () => useContext(BasicContext);

//
function isAuthUser() {
  if (localStorage.getItem("auth")) {
    return true;
  }
  return false;
}

//
const BasicContextProvider = (props: { children: object }) => {
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
    <BasicContext.Provider
      value={{
        auth,
        authenticateUser,
        logoutUser,
      }}
    >
      {props.children}
    </BasicContext.Provider>
  );
};

//
export default BasicContextProvider;
