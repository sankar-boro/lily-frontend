import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";

const Main = () => {
    const context = useBookContext();
    const { dispatch } = context;
    const authContext = useAuthContext();
    const { setRead } = authContext;
    const history: any = useHistory();
    const { bookId } = history.location.state;

    const initState = () => {
        dispatch({
            type: 'SETTER',
            _setter: 'bookId',
            payload: bookId,
        });
        setRead(true);
    }
    useEffect(initState, [dispatch, bookId]);

    if(!context.apiData) return <div>Fetching...</div>;
    return <Renderer />;
}

const Renderer = () => {
    return <div className="flex">
        <NavigationRenderer />
        <BodyRenderer />
    </div>  
}

export default function MainContext(){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}