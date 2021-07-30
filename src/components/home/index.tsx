import React, { useState, useEffect } from "react";
import { useAuthContext, AuthService } from "../../service/AuthServiceProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import { books as booksCache } from "../data";
import { useHistory } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import ViewBook from "../read";
import Profile from "../profile";
import NewBook from "../create";
import NewBlog from "../forms/blog";
import EditBook from "../edit/index";
import { logout } from "./util";
import Card from "./card";

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
                        <Link to="/" className="nav-link">
                            Lily
                        </Link>
                    </div>
                    <div className="nav-section">Search</div>
                </div>
                <div className="nav-main-center"></div>
                <div className="nav-main-right">
                    <div className="dropdown">
                        <button className="dropbtn">
                            Create
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link to="/new/blog">Blog</Link>
                            <Link to="/new/book">Book</Link>
                        </div>
                    </div>
                    <div className="nav-section">
                        <Link to="/profile" className="nav-link">
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
                    <Route path="/book/view/:bookId">
                        <ViewBook />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                    <Route path="/new/book">
                        <NewBook />
                    </Route>
                    <Route path="/new/blog">
                        <NewBlog />
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
                // console.log("Failed to get document", err.response);
            });
    }, []);

    return (
        <>
            {books
                .filter((a: any) => a.identity === 101)
                .map((data: any) => {
                    return <Card history={history} data={data} />;
                })}
        </>
    );
};

export default Home;
