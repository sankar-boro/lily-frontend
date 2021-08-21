import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext} from "../../service/BookServiceProvider";

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
    const context = useBookContext();
    console.log('context', context);
    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80">
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
                                        }}
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
                                        }}
                                        placeholder="Body of your document."
                                        className="form-input"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    name="Submit"
                                    className="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form107;
