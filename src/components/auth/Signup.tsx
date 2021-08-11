import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { signup } from "./util";

const Login = () => {
    const [email, setEmail] = useState("sankar.boro@yahoo.com");
    const [password, setPassword] = useState("sankar");
    const [fname, setFname] = useState("Sankar");
    const [lname, setLname] = useState("boro");
    const history = useHistory();

    //
    return (
        <div className="login-container">
            <div className="header">Sign up</div>
            <form action="#" method="post">
                <div style={{ marginBottom: 10}}>
                    <div>
                        <div className="email-label">Email*</div>    
                        <input
                            type="text"
                            placeholder="Email*"
                            name="email"
                            required
                            className="auth-input"
                            onChange={(e) => {
                                e.preventDefault();
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <div className="input-label">First name*</div>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstname"
                            required
                            className="auth-input"
                            onChange={(e) => {
                                e.preventDefault();
                                setFname(e.target.value);
                            }}
                            />
                    </div>
                    <div>
                        <div className="input-label">Last name*</div>
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastname"
                            required
                            className="auth-input"
                            onChange={(e) => {
                                e.preventDefault();
                                setLname(e.target.value);
                            }}
                            />
                    </div>
                    <div>
                        <div className="input-label">Password*</div>
                        <input
                            type="password"
                            placeholder="Password*"
                            name="password"
                            required
                            className="auth-input"
                            onChange={(e) => {
                                e.preventDefault();
                                setPassword(e.target.value);
                            }}
                            />
                    </div>
                </div>
                <div style={{display: "flex",justifyContent:"space-between"}}>
                    <div>
                        <button
                            type="button"
                            value="Submit"
                            className="button button-relative button-secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                signup({
                                    email,
                                    password,
                                    fname,
                                    lname,
                                    history,
                                });
                            }}
                            >
                            Submit
                        </button>
                    </div>
                    <div>
                        <div className="button button-relative button-tertiary" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <Link to="/" style={{color: "#5d5d5d"}}>Login</Link>
                        </div>
                    </div>
                </div>
            </form>
        </ div>
    );
};

export default Login;
