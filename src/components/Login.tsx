import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useBasicContext } from "../BasicContextProvider";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useBasicContext();
  //
  const login = () => {
    axios
      .post("http://localhost:8000/login", {
        email,
        password,
      })
      .then((res: AxiosResponse<{ token: string }>) => {
        if (res && res.data && res.data.token) {
          localStorage.setItem("auth", res.data.token);
          context.authenticateUser();
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
          type="text"
          placeholder="Email*"
          name="email"
          required
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />
        <br />
        <input
          type="password"
          placeholder="Password*"
          name="password"
          required
          onChange={(e) => {
            e.preventDefault();
            setPassword(e.target.value);
          }}
        />
        <br />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
        >
          Login
        </button>
      </form>

      <Link to="/signup">Sign up</Link>
    </>
  );
};

export default Login;
