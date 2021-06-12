import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthContext } from "../AuthServiceProvider";
import { Link } from "react-router-dom";

const inputs = {
  email: {
    type: "text",
    placeholder: "Email*",
    name: "email",
    required: true,
  },
  password: {
    type: "password",
    placeholder: "Password*",
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
      .then((res: AxiosResponse<{ token: string }>) => {
        if (res && res.data && res.data.token) {
          const token = res.data.token;
          console.log(token);
          localStorage.setItem("auth", token);
          context.authenticateUser(token);
        }
      })
      .catch((err: AxiosError<any>) => {
        console.log(err);
      });
  };

  //
  return (
    <>
      <form action="#" method="post">
        <input
          {...inputs.email}
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />
        <br />
        <input
          {...inputs.password}
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
            login();
          }}
        />
      </form>

      <Link to="/signup">Sign up</Link>
    </>
  );
};

export default Login;
