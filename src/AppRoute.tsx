import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BasicContextProvider, { useBasicContext } from "./BasicContextProvider";

//
const AuthRoute = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

//
const NotAuthRoute = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};

//
const CurrentComponents = () => {
  const context = useBasicContext();
  const { auth } = context;

  if (auth) return <AuthRoute />;
  return <NotAuthRoute />;
};

//
const AppRoute = () => {
  return (
    <BasicContextProvider>
      <CurrentComponents />
    </BasicContextProvider>
  );
};

//
export default AppRoute;
