import { useEffect, useState } from "react";
import axios from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext } from "../../service/BookServiceProvider";

const submitBook = (props: any) => {
    const url = "http://localhost:8000/book/update";
    axios.post(
        url,
        props,
        {
            withCredentials: true,
        }
    );
};

const Update = () => {
    const context: any = useBookContext();
    const { formData, bookId } = context;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [identity, setIdentity] = useState<number | null>(null);
    
    useEffect(() => {
        const { title, body, identity } = formData;
        setTitle(title);
        setBody(body);
        setIdentity(identity);
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
                                    identity,
                                    bookId,
                                    uniqueId: formData.uniqueId,
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
