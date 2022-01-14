import React from 'react';
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import ViewBook from "../read";
import Profile from "../profile";
import NewBook from "../create";
import NewBlog from "../forms/blog";
import EditBook from "../edit/index";
import Home from "./Home";

const Main = () => {
    return (
        <div className="home">
            <Header />
            <div className="body">
                <Routes>
                    <Route path="/book/view/:bookId" element={ <ViewBook /> } />
                    <Route path="/profile" element={ <Profile /> } />
                    <Route path="/new/book" element={ <NewBook /> } />
                    <Route path="/new/blog" element={ <NewBlog /> } />
                    <Route path="/book/edit/:bookId" element={ <EditBook /> } />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </div>
    );
};

export default Main;
