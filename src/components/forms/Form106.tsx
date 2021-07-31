import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";

const createNewSubSection = (props: {
    title: string;
    body: string;
    identity: number | null;
    parentId: string | null;
    bookId: string;
}) => {
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
    const { sectionProps, bookId } = props;
    const { sectionId, sectionChildren } = sectionProps;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    let parentId = sectionId;
    if (sectionChildren.length > 0) {
        parentId = sectionChildren[sectionChildren.length - 1].uniqueId;
    }
    return (
        <div style={{ marginTop: 50, borderTop: "1px solid #ccc" }}>
            <div className="form-header">Create New Sub-Section</div>
            <form action="#" method="post">
                <label className="active-label">
                    {title ? "Enter book title/name" : ""}
                </label>
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
                <label className="active-label">
                    {body ? "Body of your document" : ""}
                </label>
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
                        createNewSubSection({
                            bookId,
                            title,
                            body,
                            parentId,
                            identity: 106,
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
