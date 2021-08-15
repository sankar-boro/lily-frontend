import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";

const createNewSubSection = (props: {
    title: string;
    body: string;
    identity: number;
    parentId: string;
    bookId: string;
    topUniqueId: string;
    botUniqueId: string;
}) => {
    const {
        title,
        body,
        identity,
        parentId,
        bookId,
        topUniqueId,
        botUniqueId,
    } = props;
    axios
        .post(
            "http://localhost:8000/book/create/update/item",
            {
                title,
                body,
                identity,
                parentId,
                bookId,
                topUniqueId,
                botUniqueId,
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

const Form107 = (props: any) => {
    const { bookId, currentFormType } = props;
    // const { sectionId, sectionChildren } = sectionProps;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    // let parentId = sectionId;
    // if (sectionChildren.length > 0) {
    //     parentId = sectionChildren[sectionChildren.length - 1].uniqueId;
    // }

    let topUniqueId: string = "";
    let botUniqueId: string = "";
    let identity = 0;

    if (currentFormType.formData && currentFormType.formData.some) {
        topUniqueId = currentFormType.formData.val.topUniqueId;
        botUniqueId = currentFormType.formData.val.botUniqueId;
        identity = currentFormType.formData.val.identity;
    }
    return (
        <div className="lg-container">
            <div className="form-header">Form #107</div>
            <form action="#" method="post">
                <label className="active-label">
                    {body ? "Body of your document" : ""}
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
                            parentId: topUniqueId,
                            identity,
                            topUniqueId,
                            botUniqueId,
                        });
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form107;
