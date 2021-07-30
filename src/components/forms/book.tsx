import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Some, Option, None } from "ts-results";

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
type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

enum FormType {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
}
type Form = {
    formType: FormType;
    formData: Option<FormData>;
};

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
                setBookRows([...bookRows, ...[res.data.data]]);
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
            <div className="section">Create Front Cover</div>
            <form action="#" method="post">
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
                        submitBook({
                            title,
                            body,
                            identity: 101,
                            setBookRows,
                            bookRows,
                        });
                    }}
                />
            </form>
        </div>
    );
};

export default Form101;
