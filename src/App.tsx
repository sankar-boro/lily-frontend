import React from "react";
import RouteComponent, { Router } from "./route";
import Home from "./components/home";
import Login from "./components/login";

const App = () => {
  return (
    <RouteComponent>
      <Router component={Home} route="/" />
      <Router component={Login} route="/login" />
    </RouteComponent>
  );
};

export default App;
