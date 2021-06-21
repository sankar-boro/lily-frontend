import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./index.css";

const submitDocument = (props: { title: string; description: string }) => {
    const { title, description } = props;
    axios
        .post(
            "http://localhost:8000/book/create",
            {
                title,
                description,
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

const NewDocumentForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
                        <input
                            type="text"
                            placeholder="About your book."
                            name="description"
                            required
                            onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }}
                        />
                        <br />
                        <input
                            className="new-doc-submit-btn"
                            type="button"
                            value="Submit"
                            onClick={(e) => {
                                e.preventDefault();
                                submitDocument({
                                    title,
                                    description,
                                });
                            }}
                        />
                    </form>
                </div>
            </div>
            <div>
                <div>{title}</div>
                <div>{description}</div>
            </div>
        </div>
    );
};

export default NewDocumentForm;
