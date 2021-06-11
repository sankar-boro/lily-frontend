import React from "react";
import { useBasicContext, Basic } from "../BasicContextProvider";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, context: Basic) => {
  e.preventDefault();
  if (localStorage.getItem("auth")) {
    localStorage.removeItem("auth");
    context.logoutUser();
  }
};

const Home = () => {
  const context = useBasicContext();
  return (
    <div>
      Home
      <button onClick={(e) => logout(e, context)}>Logout</button>
    </div>
  );
};

export default Home;
