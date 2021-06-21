import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuthContext, AuthService } from "../AuthServiceProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./index.css";
import { books as booksCache } from "./data";
import { useHistory } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import ViewDocument from "./ViewDocument";
import Profile from "../components/profile";
import NewDocument from "../components/form/create";
import EditBook from "../components/edit/index";

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
    const context = useAuthContext();
    const read = context.read;
    const userData = context.authUserData;
    let userInfo = null;
    if (context.auth) {
        userInfo = userData.unwrap();
    }
    return (
        <div className="app-container">
            <div
                className="navbar navbar-main"
                style={{ display: read ? "none" : undefined }}
            >
                <div className="nav-main-left">
                    <div className="nav-section">
                        <Link to="/" style={{ width: "100%", height: "100%" }}>
                            Lily
                        </Link>
                    </div>
                    <div className="nav-section">Search</div>
                </div>
                <div className="nav-main-center"></div>
                <div className="nav-main-right">
                    <div
                        className="nav-section"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Link
                            to="/new/document"
                            style={{ width: "100%", height: "100%" }}
                        >
                            New Document
                        </Link>
                    </div>
                    <div className="nav-section">
                        <Link
                            to="/profile"
                            style={{ width: "100%", height: "100%" }}
                        >
                            {userInfo?.fname} {userInfo?.lname}
                        </Link>
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
                <Switch>
                    <Route path="/document">
                        <ViewDocument />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                    <Route path="/new/document">
                        <NewDocument />
                    </Route>
                    <Route path="/book/edit/:bookId">
                        <EditBook />
                    </Route>
                    <Route path="/">
                        <HomeDocBody />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

const HomeDocBody = () => {
    return <div className="documents-container">{AllDocuments()}</div>;
};

const AllDocuments = () => {
    const [books, setBooks] = useState(booksCache);
    const history = useHistory();
    useEffect(() => {
        axios
            .get("http://localhost:8000/book/all", {
                withCredentials: true,
            })
            .then((res: AxiosResponse<[]>) => {
                if (
                    res.status &&
                    typeof res.status === "number" &&
                    res.status === 200
                ) {
                    setBooks(res.data);
                }
            })
            .catch((err: AxiosError<any>) => {
                console.log("Failed to get document", err.response);
            });
    }, []);
    console.log("books", books);
    return (
        <>
            {books.map(
                (data: {
                    authorId: string;
                    description: string;
                    bookId: string;
                    title: string;
                }) => {
                    return (
                        <div
                            className="document-card"
                            key={data.bookId}
                            onClick={() => {
                                history.push({
                                    pathname: "/document",
                                    state: data,
                                });
                            }}
                        >
                            <div>
                                <div className="document-title">
                                    {data.title}
                                </div>
                                <div className="document-body">
                                    {data.description}
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
        </>
    );
};

export default Home;
