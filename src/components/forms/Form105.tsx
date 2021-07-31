import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";

const createNewSection = (props: {
    title: string;
    body: string;
    identity: number | null;
    parentId: string | null;
    bookId: string;
}) => {
    // console.log("props", props);
    const { title, body, identity, parentId, bookId } = props;
    axios
        .post(
            "http://localhost:8000/book/create/new/section",
            {
                title,
                body,
                identity,
                parentId,
                bookId,
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
                // console.log(res);
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err.response);
        });
};

const Form102 = (props: any) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const { bookId, parentId } = props;
    return (
        <div className="lg-container">
            <div className="form-header">Section #105</div>
            <form action="#" method="post">
                <label className="active-label">{title ? "Title" : ""}</label>
                <br />
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                    value={title}
                    className="input no-border"
                />
                <br />
                <label className="active-label">{body ? "Body" : ""}</label>
                <br />
                <textarea
                    id="body"
                    name="Body"
                    rows={textareaRows}
                    cols={textareaCols}
                    onChange={(e) => {
                        e.preventDefault();
                        setBody(e.target.value);
                    }}
                    placeholder="Body of your document."
                    value={body}
                    className="textarea no-border"
                />
                <br />
                <button
                    type="submit"
                    name="Submit"
                    className="button button-relative button-secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        createNewSection({
                            title,
                            body,
                            identity: 105,
                            parentId,
                            bookId,
                        });
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form102;
