import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthContext, UserInfo } from "../../service/AuthServiceProvider";
import { Link } from "react-router-dom";

const inputs = {
    email: {
        type: "text",
        // placeholder: "Email*",
        name: "email",
        required: true,
    },
    password: {
        type: "password",
        // placeholder: "Password*",
        name: "password",
        required: true,
    },
};

//
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const context = useAuthContext();
    //
    const login = () => {
        axios
            .post(
                "http://localhost:8000/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            )
            .then((res: AxiosResponse<UserInfo>) => {
                if (res && res.data) {
                    // console.log(res.data);
                    context.authenticateUser(res.data);
                    // const token = res.data.token;
                    // localStorage.setItem("auth", token);
                }
            })
            .catch((err: AxiosError<any>) => {
                // console.log(err);
            });
    };

    //
    return (
        <div className="login-container">
            <div className="header">Login</div>
            <form action="#" method="post">
                <div>
                    <div className="email-label">Email*</div>
                    <input
                        {...inputs.email}
                        onChange={(e) => {
                            e.preventDefault();
                            setEmail(e.target.value);
                        }}
                        className="login-input"
                        value={email}
                    />
                </div>
                <div>
                    <div className="password-label">Password*</div>
                    <input
                        {...inputs.password}
                        onChange={(e) => {
                            e.preventDefault();
                            setPassword(e.target.value);
                        }}
                        className="login-input"
                        value={password}
                    />
                </div>
                <div style={{ marginTop: 20 }}>
                    <input
                        type="button"
                        value="Login"
                        onClick={(e) => {
                            e.preventDefault();
                            login();
                        }}
                        className="login-button"
                    />
                </div>
            </form>

            <Link to="/signup" className="link">
                Sign up
            </Link>
        </div>
    );
};

export default Login;
