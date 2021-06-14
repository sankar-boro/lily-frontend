import React, { useState, useEffect } from "react";
import { useAuthContext, AuthService } from "../AuthServiceProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./index.css";
import { documents as docs } from "./data";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, context: AuthService) => {
    e.preventDefault();
    axios
        .post(
            "http://localhost:8000/logout",
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
                context.logoutUser();
            }
        })
        .catch((err: AxiosError<any>) => {
            console.log("Logout Error", err.response);
        });
};

const Home = () => {
    const [createNewDocument, toggleCreateNewDocument] = useState(false);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [body, setBody] = useState("");
    const context = useAuthContext();
    const userData = context.authUserData;
    let userInfo = null;
    if (context.auth) {
        userInfo = userData.unwrap();
    }

    return (
        <div className="app-container">
            <div className="navbar navbar-main">
                <div className="nav-main-left">
                    <div className="nav-section">Lily</div>
                    <div className="nav-section">Search</div>
                </div>
                <div className="nav-main-center"></div>
                <div className="nav-main-right">
                    <div
                        className="nav-section"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleCreateNewDocument(!createNewDocument);
                        }}
                    >
                        New Document
                    </div>
                    <div className="nav-section">
                        {userInfo?.fname} {userInfo?.lname}
                    </div>
                    <button
                        className="button-nav nav-section"
                        onClick={(e) => logout(e, context)}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="body-home">
                <div className="navbar-left"></div>
                <div className="body-container">
                    <div className="toolbar">
                        <div className="document-categories">
                            <div className="document-section">Novels</div>
                            <div className="document-section">Science</div>
                            <div className="document-section">Maths</div>
                            <div className="document-section">History</div>
                        </div>
                        <div className="settings"></div>
                    </div>
                    {createNewDocument
                        ? NewDocumentForm({
                              title,
                              tags,
                              body,
                              setTitle,
                              setTags,
                              setBody,
                          })
                        : null}
                    <div className="documents-container">{AllDocuments()}</div>
                </div>
            </div>
        </div>
    );
};

const AllDocuments = () => {
    const [documents, setDocuments] = useState(docs);
    // useEffect(() => {
    //     axios
    //         .get("http://localhost:8000/post/all", {
    //             withCredentials: true,
    //         })
    //         .then((res: AxiosResponse<[]>) => {
    //             if (
    //                 res.status &&
    //                 typeof res.status === "number" &&
    //                 res.status === 200
    //             ) {
    //                 setDocuments(res.data);
    //             }
    //         })
    //         .catch((err: AxiosError<any>) => {
    //             console.log("Failed to get document", err.response);
    //         });
    // }, []);
    return (
        <>
            {documents.map(
                (data: {
                    authorId: string;
                    body: string;
                    documentId: string;
                    tags: string;
                    title: string;
                }) => {
                    return (
                        <div className="document-card" key={data.documentId}>
                            <div>
                                <div className="document-title">
                                    {data.title}
                                </div>
                                <div className="document-body">
                                    {data.body.substr(0, 350)}
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
        </>
    );
};

const NewDocumentForm = (props: {
    title: string;
    tags: string;
    body: string;
    setTitle: any;
    setTags: any;
    setBody: any;
}) => {
    const { title, tags, body, setTitle, setTags, setBody } = props;
    const submitDocument = () => {
        axios
            .post(
                "http://localhost:8000/post/create",
                {
                    title,
                    tags,
                    body,
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
                console.log("SignupError", err.response);
            });
    };

    return (
        <div className="new-document">
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
                />
                <br />
                <input
                    type="text"
                    placeholder="Tags"
                    name="tags"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        setTags(e.target.value);
                    }}
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
                />
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        submitDocument();
                    }}
                />
            </form>
        </div>
    );
};

export default Home;
