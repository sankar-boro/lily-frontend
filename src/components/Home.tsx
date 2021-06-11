import React from "react";
import { useAuthContext, AuthService } from "../AuthServiceProvider";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, context: AuthService) => {
  e.preventDefault();
  if (localStorage.getItem("auth")) {
    localStorage.removeItem("auth");
    context.logoutUser();
  }
};

const Home = () => {
  const context = useAuthContext();
  return (
    <div>
      Home
      <button onClick={(e) => logout(e, context)}>Logout</button>
    </div>
  );
};

export default Home;
