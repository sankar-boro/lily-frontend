import React, { useState, useEffect } from "react";
import Login from "./components/login/index";
import Blog from "./components/blog/index";
import { BasicContext } from "./BasicContextProvider";

const App: React.FC = (): JSX.Element => {
  const [auth, updateAuth] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("auth");
    if (token && token.length > 0) {
      updateAuth(true);
    }
    setInit(true);
  }, []);

  return (
    <BasicContext.Provider value={{ auth, updateAuth, init }}>
      {auth ? <Blog /> : <Login />}
    </BasicContext.Provider>
  );
};

export default App;
