import React, { useContext, useEffect, useState } from "react";
import { Option, None, Some } from "ts-results";
import axios, { AxiosError, AxiosResponse } from "axios";

export type UserInfo = {
    userId: string;
    fname: string;
    lname: string;
    email: string;
};
export type AuthService = {
    initializing: boolean;
    auth: boolean;
    authUserData: Option<UserInfo>;
    authToken: Option<string>;
    authenticateUser: (token: UserInfo) => void;
    logoutUser: () => void;
};
export const AuthContext = React.createContext<AuthService>({
    initializing: true,
    auth: false,
    authUserData: None,
    authToken: None,
    authenticateUser: (token: UserInfo) => {},
    logoutUser: () => {},
});
export const useAuthContext = () => useContext(AuthContext);
function clearAllStorage() {
    localStorage.removeItem("auth");
}
const AuthServiceProvider = (props: { children: object }) => {
    const [initializing, setInitializing] = useState(false);
    const [authUserData, setAuthUserData] = useState<Option<UserInfo>>(
        Some({
            userId: "1",
            fname: "Sankar",
            lname: "boro",
            email: "sankar.boro@yahoo.com",
        })
    );
    const [auth, setAuth] = useState<boolean>(true);
    const [authToken, setAuthToken] = useState<Option<string>>(None);
    // useEffect(() => {
    //     axios
    //         .get("http://localhost:8000/user/session", {
    //             withCredentials: true,
    //         })
    //         .then((res: AxiosResponse<UserInfo>) => {
    //             if (res && res.data) {
    //                 authenticateUser(res.data);
    //                 setInitializing(false);
    //                 setInitializing(false);
    //             }
    //         })
    //         .catch((err: AxiosError<any>) => {
    //             console.log(err);
    //             setInitializing(false);
    //         });
    // }, []);
    const authenticateUser = async (userInfo: UserInfo) => {
        setAuthUserData(Some(userInfo));
        setAuth(true);
    };
    const logoutUser = () => {
        setAuth(false);
        clearAllStorage();
        setAuthUserData(None);
        setAuthToken(None);
    };
    return (
        <AuthContext.Provider
            value={{
                auth,
                authUserData,
                authToken,
                initializing,
                authenticateUser,
                logoutUser,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
export default AuthServiceProvider;
