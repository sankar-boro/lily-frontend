import { stringify } from "querystring";
import React, {
  ComponentType,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

interface RouteElements {
  [index: string]: () => JSX.Element;
}

export type Route = {
  routes: RouteElements;
  //   newRoute: (path: string, component: React.FunctionComponent<object>) => void;
};

export const RouteContext = React.createContext<Route>({
  routes: {},
  //   newRoute: () => {},
});

const Default = () => {
  return <div>You have not set any routes yet.</div>;
};

export const useRouteContext = () => useContext(RouteContext);

export const Router = (props: any) => null;

const RouteComponent = (props: any) => {
  const { children } = props;
  let newElement: RouteElements = {
    "/": Default,
  };
  let firstComponent = "/";
  children.forEach(
    (
      prop: { props: { route: string; component: () => JSX.Element } },
      index: number
    ) => {
      if (index === 0) {
        firstComponent = prop.props.route;
      }
      newElement[prop.props.route] = prop.props.component;
    }
  );

  const [currentComponent, setCurrentComponent] = useState(firstComponent);
  const [Component, setComponent] = useState<RouteElements>(newElement);

  let ONE = Component[currentComponent];
  return (
    <RouteContext.Provider value={{ routes: {} }}>
      <ONE />
    </RouteContext.Provider>
  );
};

export default RouteComponent;
