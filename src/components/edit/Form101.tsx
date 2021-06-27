import { useState } from "react";

const Form101 = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    return (
        <form action="#" method="post">
            <input
                type="text"
                placeholder="Title"
                name="title"
                required
                onChange={(e) => {
                    e.preventDefault();
                    // setTitle(e.target.value);
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
                    // setBody(e.target.value);
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
                    // submitDocument();
                }}
            />
        </form>
    );
};

export default Form101;
