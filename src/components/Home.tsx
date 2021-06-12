import React, { useState } from "react";
import { useAuthContext, AuthService } from "../AuthServiceProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, useHistory } from "react-router-dom";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, context: AuthService) => {
  e.preventDefault();
  context.logoutUser();
};

const Home = () => {
  const context = useAuthContext();
  const userData = context.authUserData;
  const token = context.authToken;
  let userInfo = null;
  let sessionToken = "";
  if (context.auth) {
    userInfo = userData.unwrap();
    sessionToken = token.unwrap();
  }

  console.log(context);

  return (
    <div>
      <div> Hello World!</div>
      <div>
        My name is {userInfo?.fname} {userInfo?.lname}{" "}
      </div>
      {NewDocumentForm(sessionToken, userInfo?.userId)}
      <button onClick={(e) => logout(e, context)}>Logout</button>
    </div>
  );
};

const NewDocumentForm = (token: string, userId: string | undefined) => {
  console.log(userId);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const submitDocument = () => {
    axios
      .post(
        "http://localhost:8000/post/create",
        {
          title,
          tags,
          body,
          authorId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res: AxiosResponse<{ status: number }>) => {
        if (
          res.status &&
          typeof res.status === "number" &&
          res.status === 200
        ) {
          console.log(res);
        }
      })
      .catch((err: AxiosError<any>) => {
        console.log("SignupError", err);
      });
  };

  return (
    <>
      <form action="#" method="post">
        <input
          type="text"
          placeholder="Title"
          name="title"
          required
          onChange={(e) => {
            e.preventDefault();
            setTitle(e.target.value);
          }}
        />
        <br />
        <input
          type="text"
          placeholder="Tags"
          name="tags"
          required
          onChange={(e) => {
            e.preventDefault();
            setTags(e.target.value);
          }}
        />
        <br />
        <textarea
          id="body"
          name="Body"
          rows={4}
          cols={50}
          onChange={(e) => {
            e.preventDefault();
            setBody(e.target.value);
          }}
          placeholder="Body of your document."
        />
        <br />
        <input
          type="button"
          value="Submit"
          onClick={(e) => {
            e.preventDefault();
            submitDocument();
          }}
        />
      </form>
    </>
  );
};

export default Home;
