import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";

const Main = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: any = useHistory();

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

    return <Renderer />
}

const Renderer = () => {
    return <div className="container-flex">
        <NavigationRenderer />
        <BodyRenderer />
    </div>  
}

export default function MainContext(props: any){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}