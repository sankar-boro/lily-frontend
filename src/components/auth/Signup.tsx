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
        <>
            <form action="#" method="post">
                <input
                    type="text"
                    placeholder="Email*"
                    name="email"
                    required
                    defaultValue="sankar.boro@yahoo.com"
                    onChange={(e) => {
                        e.preventDefault();
                        setEmail(e.target.value);
                    }}
                />
                <br />
                <input
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    required
                    defaultValue="Sankar"
                    onChange={(e) => {
                        e.preventDefault();
                        setFname(e.target.value);
                    }}
                />
                <br />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    required
                    defaultValue="boro"
                    onChange={(e) => {
                        e.preventDefault();
                        setLname(e.target.value);
                    }}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password*"
                    name="password"
                    required
                    defaultValue="sankar"
                    onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                    }}
                />
                <br />
                <input
                    type="button"
                    value="Submit"
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
                />
            </form>

            <Link to="/">Login</Link>
        </>
    );
};

export default Login;
