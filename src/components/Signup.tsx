import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useBasicContext } from "../BasicContextProvider";
import { Link, useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const history = useHistory();
  //
  const signup = () => {
    axios
      .post("http://localhost:8000/signup", {
        email,
        password,
        fname: firstname,
        lname: lastname,
      })
      .then((res: AxiosResponse<any>) => {
        history.goBack();
        console.log("Signup", res);
      })
      .catch((err: AxiosError<any>) => {
        console.log("SignupError", err);
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
          type="text"
          placeholder="First Name"
          name="firstname"
          required
          onChange={(e) => {
            e.preventDefault();
            setFirstname(e.target.value);
          }}
        />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          name="lastname"
          required
          onChange={(e) => {
            e.preventDefault();
            setLastname(e.target.value);
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
          onClick={() => {
            signup();
          }}
        >
          Sign Up
        </button>
      </form>

      <Link to="/">Login</Link>
    </>
  );
};

export default Login;
