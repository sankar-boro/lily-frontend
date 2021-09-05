import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Book } from "../../globals/types/book";
import { Form } from "../../globals/types";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext } from "../../service/BookServiceProvider";

const submitBook = (props: {
}) => {
    axios
        .post(
            "http://localhost:8000/book/create/new/book",
            {
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
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err.response);
        });
};

const Update = () => {
    const context: any = useBookContext();
    const { formData } = context;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [identity, setIdentity] = useState<number | null>(null);

    useEffect(() => {
        setTitle(formData.title);
        setBody(formData.body);
        setIdentity(formData.identity);
    }, []);

    return (
        <div className="container">
            <div className="container-create-book">
                <div className="h1">Create Front Cover</div>
                <div className="container-form">
                    <form action="#" method="post">
                        <div className="group-form-input">
                            <div className="form-section">
                                <div className="form-label">Enter book title/name*</div>
                                <input
                                    type="text"
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
                                <div className="form-label">Body of your document*</div>
                                <textarea
                                    id="body"
                                    name="Body"
                                    rows={textareaRows}
                                    cols={textareaCols}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setBody(e.target.value);
                                    }}
                                    value={body}
                                    className="form-input"
                                />
                            </div>
                        </div>
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
                                });
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>    
            </div>
        </div>
    );
};

export default Update;
