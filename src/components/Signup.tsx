import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("sankar.boro@yahoo.com");
  const [password, setPassword] = useState("sankar");
  const [firstname, setFirstname] = useState("Sankar");
  const [lastname, setLastname] = useState("boro");
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
      .then((res: AxiosResponse<{ status: number }>) => {
        if (
          res.status &&
          typeof res.status === "number" &&
          res.status === 200
        ) {
          history.goBack();
        }
      })
      .catch((err: AxiosError<any>) => {
        // console.log("SignupError", err);
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
            setFirstname(e.target.value);
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
            setLastname(e.target.value);
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
            signup();
          }}
        />
      </form>

      <Link to="/">Login</Link>
    </>
  );
};

export default Login;
