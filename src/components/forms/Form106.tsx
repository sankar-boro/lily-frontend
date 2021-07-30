import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";

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
        <div>
            <div>Create New Sub-Section</div>
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
                        createNewSubSection({
                            bookId,
                            title,
                            body,
                            parentId,
                            identity: 106,
                        });
                    }}
                />
            </form>
        </div>
    );
};

export default Form102;
