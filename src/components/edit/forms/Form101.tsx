import { useState } from "react";

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

const Form101 = (props: { allPages: Book[] }) => {
    console.log("form101", props);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const { allPages } = props;
    return (
        <div>
            <div>Create Front Cover</div>
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
                        console.log(e.target.value);
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
                        // submitDocument();
                    }}
                />
            </form>
        </div>
    );
};

export default Form101;
