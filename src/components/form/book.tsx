import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./index.css";

const submitBook = (props: {
    title: string;
    body: string;
    identity: number;
}) => {
    const { title, body, identity } = props;
    axios
        .post(
            "http://localhost:8000/book/create/new/book",
            {
                title,
                body,
                identity,
            },
            {
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
            console.log("SignupError", err.response);
        });
};

const NewBookForm = () => {
    const [title, setTitle] = useState("");
    const [body, setDescription] = useState("");

    return (
        <div className="form-container">
            <div>
                <div className="new-document">
                    <form action="#" method="post">
                        <input
                            type="text"
                            placeholder="Title or Name of the Book"
                            name="title"
                            required
                            onChange={(e) => {
                                e.preventDefault();
                                setTitle(e.target.value);
                            }}
                        />
                        <br />
                        <textarea
                            rows={30}
                            cols={50}
                            placeholder="About your book"
                            onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }}
                            required
                        ></textarea>
                        <br />
                        <input
                            className="new-doc-submit-btn"
                            type="button"
                            value="Submit"
                            onClick={(e) => {
                                e.preventDefault();
                                if (title && body) {
                                    submitBook({
                                        title,
                                        body,
                                        identity: 101,
                                    });
                                }
                            }}
                        />
                    </form>
                </div>
            </div>
            <div>
                <div>{title}</div>
                <div>{body}</div>
            </div>
        </div>
    );
};

export default NewBookForm;
