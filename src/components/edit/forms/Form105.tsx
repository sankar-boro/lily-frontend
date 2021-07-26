import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";

type Book = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    parentId: string | null;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
};

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
            <div>Create New Section</div>
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
                    value={title}
                />
                <br />
                <textarea
                    id="body"
                    name="Body"
                    rows={12}
                    cols={50}
                    onChange={(e) => {
                        e.preventDefault();
                        setBody(e.target.value);
                    }}
                    placeholder="Body of your document."
                    value={body}
                />
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
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
                />
            </form>
        </div>
    );
};

export default Form102;
