import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";
import { Request } from '../../globals/types';

const Body = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: any = useHistory();
    const { dispatch } = context;
    const { setRead } = authContext;
    const { bookId } = history.location.state;

    const initState = () => {
        dispatch({
            type: 'ID_SETTER',
            idType: 'BOOK',
            payload: bookId,
        });
        setRead(true);
    }

    useEffect(initState, [dispatch, setRead, bookId]);

    if(context.service.state === Request.INIT) return <div>Fetching...</div>;
    if(context.service.state === Request.FETCH) return <div>Initializing...</div>;
    if(context.service.state === Request.SUCCESS) return <Renderer />;
    return null;
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