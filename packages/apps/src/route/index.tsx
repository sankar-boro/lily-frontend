import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import AuthServiceProvider, {
    useAuthContext,
} from "../service/AuthServiceProvider";

//
const AuthRoute = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                    {/* <Home />
                </Route> */}
            </Routes>
        </Router>
    );
};

//
const NotAuthRoute = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                    {/* <Signup /> */}
                {/* </Route> */}
                <Route path="/" element={<Login />} />
                    {/* <Login /> */}
                {/* </Route> */}
            </Routes>
        </Router>
    );
};

//
const CurrentComponents = () => {
    const context = useAuthContext();
    const { auth, initializing } = context;
    if (initializing) return <div>Loding...</div>;
    if (auth) return <AuthRoute />;
    return <NotAuthRoute />;
};

//
const AppRoute = () => {
    return (
        <AuthServiceProvider>
            <CurrentComponents />
        </AuthServiceProvider>
    );
};

//
export default AppRoute;
