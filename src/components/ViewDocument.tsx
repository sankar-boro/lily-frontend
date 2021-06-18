import React, { useState } from "react";
import { useHistory } from "react-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthContext } from "../AuthServiceProvider";

type Location = {
    state: {
        documentId: string;
        title: string;
        body: string;
        tags: string;
    };
};
const ViewDocument = () => {
    const context = useAuthContext();
    const { toggleRead } = context;
    const history: any = useHistory();
    const [edit, setEdit] = useState(false);
    const location: Location = history.location;
    const state = location.state;
    const { documentId, title, body, tags } = state;
    const [newtitle, setTitle] = useState(title);
    const [newbody, setBody] = useState(body);
    const [newtags, setTags] = useState(tags);

    const updateDocument = () => {
        axios
            .post(
                `http://localhost:8000/post/update/${documentId}`,
                {
                    title: newtitle,
                    tags: newtags,
                    body: newbody,
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
                console.log("updateerror", err.response);
            });
    };

    const deleteDocument = () => {
        axios
            .post(
                `http://localhost:8000/post/delete/${documentId}`,
                {},
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
                console.log("deleteerror", err.response);
            });
    };

    if (edit)
        return (
            <div
                className="document-details documents-container"
                key={documentId}
            >
                <div>
                    <input
                        type="text"
                        name="title"
                        value={newtitle}
                        onChange={(e) => {
                            e.preventDefault();
                            setTitle(e.target.value);
                        }}
                    />
                    <br />
                    <input
                        type="text"
                        name="tags"
                        value={newtags}
                        onChange={(e) => {
                            e.preventDefault();
                            setTags(e.target.value);
                        }}
                    />
                    <br />
                    <textarea
                        name="body"
                        rows={12}
                        cols={50}
                        value={newbody}
                        onChange={(e) => {
                            e.preventDefault();
                            setBody(e.target.value);
                        }}
                        placeholder="Body of your document."
                    />
                    <br />
                    <input
                        className="new-doc-submit-btn"
                        type="button"
                        value="Update"
                        onClick={(e) => {
                            e.preventDefault();
                            updateDocument();
                        }}
                    />
                </div>
            </div>
        );
    return (
        <div className="document-details documents-container" key={documentId}>
            <div className="settings-group">
                <div className="settings-left"></div>
                <div className="settings-right">
                    <div
                        className="settings-section"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleRead();
                        }}
                    >
                        Read
                    </div>
                    <div
                        className="settings-section"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        Edit
                    </div>
                    <div
                        className="settings-section"
                        onClick={(e) => {
                            e.preventDefault();
                            deleteDocument();
                        }}
                    >
                        Delete
                    </div>
                </div>
            </div>
            <div>
                <div className="document-title">{title}</div>
                <div className="document-body">
                    <div className="read">{body}</div>
                </div>
            </div>
        </div>
    );
};

export default ViewDocument;
