import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

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

const createNewChapter = (props: {
    title: string;
    body: string;
    identity: number | null;
    parentId: string;
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
                console.log(res);
            }
        })
        .catch((err: AxiosError<any>) => {
            console.log("SignupError", err.response);
        });
};

const Form102 = (props: { allPages: Book[]; bookId: string }) => {
    const { allPages, bookId } = props;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [parentId, setParentId] = useState("");
    console.log("props__", props);
    return (
        <div>
            <div>Create New Chapter</div>
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
                <label>Next to</label>
                <select
                    name="identity"
                    onChange={(e) => {
                        e.preventDefault();
                        setParentId(e.target.value);
                    }}
                >
                    <option>Select next to</option>
                    {allPages.map((page: Book) => {
                        return (
                            <option key={page.uniqueId} value={page.uniqueId}>
                                {page.title}
                            </option>
                        );
                    })}
                </select>
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
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
                />
            </form>
        </div>
    );
};

export default Form102;
