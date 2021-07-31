import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Book } from "../../globals/types/book";
import { Form } from "../../globals/types/form";
import { textareaRows, textareaCols } from "../../globals/forms";

const submitBook = (props: {
    title: string;
    body: string;
    identity: number;
    setBookRows: Function;
    bookRows: Book[];
}) => {
    const { title, body, identity, setBookRows, bookRows } = props;
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
        .then((res: AxiosResponse<{ status: number; data: Book }>) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                setBookRows([...bookRows, ...[res.data]]);
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err.response);
        });
};

const Form101 = (props: {
    sectionId: string | null;
    currentFormType: Form;
    setCurrentFormType: Function;
    allPages: any;
    bookId: string | null;
    parentId: string | null;
    activeId: string | null;
    setBookRows: Function;
    bookRows: Book[];
}) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const { allPages, setBookRows, bookRows } = props;
    return (
        <div className="lg-container">
            <div className="form-header">Create Front Cover</div>
            <form action="#" method="post">
                <label className="active-label">
                    {title ? "Enter book title/name" : ""}
                </label>
                <br />
                <input
                    type="text"
                    placeholder="Enter book title/name"
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
                        submitBook({
                            title,
                            body,
                            identity: 101,
                            setBookRows,
                            bookRows,
                        });
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form101;
