import { useHistory } from "react-router";
import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";

import Card from "./card";
import Header from "./Header";
import ViewBook from "../read";
import Profile from "../profile";
import NewBook from "../create";
import NewBlog from "../forms/blog";
import EditBook from "../edit/index";
import { books as booksCache } from "../data";
import { useAuthContext } from "../../service/AuthServiceProvider";

const Home = () => {
    const context = useAuthContext();
    const read = context.read;
    const userData = context.authUserData;
    let userInfo = null;
    if (context.auth) {
        userInfo = userData.unwrap();
    }
    return (
        <div className="home">
            {read ? null : <Header context={context} userInfo={userInfo }/>}
            <div className="body">
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

const AllDocuments = () => {
    const [books, setBooks] = useState(booksCache);
    const history = useHistory();
    const context = useAuthContext();
    useEffect(() => {
        context.setRead(false);
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
        <div className="container-sm">
            {books
                .filter((a: any) => a.identity === 101)
                .map((data: any) => {
                    return <Card history={history} data={data} />;
                })}
        </div>
    );
};

export default Home;
