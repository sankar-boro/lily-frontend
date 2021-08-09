import React, { useState } from "react";
import { useAuthContext, UserInfo } from "../../service/AuthServiceProvider";
import { Link } from "react-router-dom";
import { login } from "./util";

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
    const {error} = context;
    const [formContext, setFormContext] = useState<string>("IDLE");

    const loginUser = login.bind(context);
    //
    return (
        <div className="login-container">
            <div className="header">Login</div>
            <div className="form-res-error">{error && error.credentials}</div>
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
                        required
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
                        required
                    />
                </div>
                <div style={{ marginTop: 20 }}>
                    <button
                        type="submit"
                        name="Submit"
                        className="button button-relative button-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            
                            if (formContext === 'IDLE') {
                                setFormContext('SUBMITTING');
                                loginUser(email, password);
                            }
                        }}
                    >
                        Submit
                    </button>
                </div>
            </form>

            <Link to="/signup" className="link">
                Sign up
            </Link>
        </div>
    );
};

export default Login;
