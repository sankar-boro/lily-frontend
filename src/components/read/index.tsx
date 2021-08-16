import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Book, sortAll, getPages } from "./util";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";

const Main = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: {
        location: {
            state: Book;
        };
    } = useHistory();

    useEffect(() => {
        context.dispatch({
            type: 'ID_SETTER',
            idType: 'BOOK_ID',
            payload: history.location.state.bookId,
        });
        authContext.setRead(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!context.data) return <div>Fetching...</div>;

    return <Renderer title={history.location.state.title} />
}

const Renderer = (props: any) => {
    return <div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <div></div>
            <div><h2 className="h2">{props.title}</h2></div>
            <div></div>
        </div>
        <div className="container-flex">
            <NavigationRenderer />
            <BodyRenderer />
        </div>
    </div>
    
}

export default function MainContext(props: any){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}