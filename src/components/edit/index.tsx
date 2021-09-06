import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";

const Body = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: any = useHistory();
    const { dispatch } = context;
    const { setRead } = authContext;
    const { bookId } = history.location.state;

    const initState = () => {
        dispatch({
            type: 'SETTER',
            _setter: 'bookId',
            payload: bookId,
        });
        setRead(true);
    }

    useEffect(initState, [dispatch, setRead, bookId]);

    if(!context.apiData) return <div>Fetching...</div>;
    
    return <Renderer />;
}

const Renderer = () => {
    return <div className="flex">
        <NavigationRenderer />
        <BodyRenderer />
    </div>  
}

export default function Main(props: any){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}