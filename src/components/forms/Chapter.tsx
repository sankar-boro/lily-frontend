import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";

const createNewChapter = (props: {
    title: string;
    body: string;
    identity: number | null;
    parentId: string | null;
    bookId: string;
}) => {
    const { title, body, identity, parentId, bookId } = props;
    axios
        .post(
            "http://localhost:8000/book/create/new/chapter",
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

const Chapter = (props: any) => {
    const { allPages, bookId, parentId } = props;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    return (
        <div className="con-60">
            <div className="h3">Create Chapter</div>
            <div className="container-form">
                <form action="#" method="post">
                    <div className="group-form-input">
                        <div className="form-section">
                            <div className="form-label">Title*</div>
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
                                className="form-input"
                            />
                        </div>
                        <div className="form-section">
                            <div className="form-label">Body*</div>
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
                                className="form-input"
                            />
                        </div>
                        <button
                            type="submit"
                            name="Submit"
                            className="button"
                            onClick={(e) => {
                                e.preventDefault();
                                createNewChapter({
                                    title,
                                    body,
                                    parentId,
                                    identity: 104,
                                    bookId,
                                });
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chapter;
