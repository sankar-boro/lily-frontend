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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!context.data) return <div>Fetching...</div>;

    return <Renderer data={context.data} />
}

const Renderer = (props: any) => {
    return <div>
        <NavigationRenderer />
        <BodyRenderer />
    </div>
}

export default function MainContext(props: any){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}