import React, { useContext } from "react";

export type Basic = {
  auth: boolean;
  init: boolean;
  updateAuth: (status: boolean) => void;
};
export const BasicContext = React.createContext<Basic>({
  auth: false,
  init: false,
  updateAuth: (status: boolean) => {},
});

export const useBasicContext = () => useContext(BasicContext);
