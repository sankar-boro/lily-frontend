import React, { useState } from "react";
import { useAuthContext } from "../../service/AuthServiceProvider";
import { Link } from "react-router-dom";
import { login } from "./util";
import { constants } from "../../globals/constants";

const inputs = {
    email: {
        type: "text",
        name: "email",
        required: true,
    },
    password: {
        type: "password",
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
    const [state, setState] = useState<number>(constants.IDLE);

    const handles = {
        setState,
        email,
        password,
        context,
    }
    //
    return (
        <div className="login-container">
            <div className="header">Login</div>
            <div className="form-res-error">{error && error.credentials}</div>
            <form action="#" method="post">
                <div style={{ marginBottom: 10}}>
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
                </div>
                <div style={{display: "flex",justifyContent:"space-between"}}>
                    <div>
                        <button
                            type="submit"
                            name="Submit"
                            className="button button-relative button-secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                
                                if (state === constants.IDLE) {
                                    setState(constants.WAITING);
                                    login(handles);
                                }
                            }}
                            >
                            Submit
                        </button>
                    </div>
                    <div>
                        <div className="button button-relative button-tertiary" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <Link to="/signup" style={{color: "#5d5d5d"}}>
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
