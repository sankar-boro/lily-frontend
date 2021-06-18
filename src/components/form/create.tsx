import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

const submitDocument = (props: {
    title: string;
    tags: string;
    body: string;
}) => {
    const { title, tags, body } = props;
    axios
        .post(
            "http://localhost:8000/post/create",
            {
                title,
                tags,
                body,
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
    const [tags, setTags] = useState("");
    const [body, setBody] = useState("");

    return (
        <div className="new-document">
            <form action="#" method="post">
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    required
                    onChange={(e) => {
                        e.preventDefault();
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
                    }}
                />
                <br />
                <textarea
                    id="body"
                    name="Body"
                    rows={12}
                    cols={50}
                    onChange={(e) => {
                        e.preventDefault();
                    }}
                    placeholder="Body of your document."
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
                            tags,
                            body,
                        });
                    }}
                />
            </form>
        </div>
    );
};

export default NewDocumentForm;
