import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";
import { Request } from '../../globals/types';

const Main = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: any = useHistory();

    useEffect(() => {
        context.dispatch({
            type: 'ID_SETTER',
            idType: 'BOOK',
            payload: history.location.state.bookId,
        });
        authContext.setRead(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(context.service.state === Request.INIT) return <div>Initializing...</div>;
    if(context.service.state === Request.FETCH) return <div>Fetching...</div>;
    if(context.service.state === Request.SUCCESS) return <Renderer />;
    return null;
}

const Renderer = () => {
    return <div className="flex">
        <NavigationRenderer />
        <BodyRenderer />
    </div>  
}

export default function MainContext(props: any){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}