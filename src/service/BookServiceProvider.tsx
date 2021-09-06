import React, { useContext, useEffect, useReducer } from "react";
import { FORM_TYPE, BOOK_SERVICE } from "../globals/types";
import { BookHandler } from "./handlers/BookService";

const bookState = {
    apiData: null,
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    hideSection: true,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
    service: new BookHandler(),
}

export const BookContext = React.createContext({
    apiData: null,
    service: new BookHandler(),
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: [],
    hideSection: true,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
});

export const useBookContext = () => useContext(BookContext);

const fetchData = (state: any, dispatch: Function) => {
    const { apiState, service, bookId } = state;
    // We only want this function to be performed once
    if (apiState) return;
    service.fetch(bookId).then((context: any) => {
        let res = context.map_res().data;
        dispatch({
            ...state,
            type: 'API_STATE',
            status: 'SUCCESS',
            payload: res,
        });
        dispatch({
            type: 'ACTIVE_PAGE',
            pageId: state.bookId,
            sectionId: null,
        });
        // setActiveId(bookData, state.bookId, dispatch);
    })
}

const setter = (state: any, action: any) => {
    const { payload, _setter } = action;
    return { ...state, [_setter]: payload };
}

const formPageSetter = (state: any, action: any) => {
    const { payload, viewType } = action;
    switch (viewType) {
        case FORM_TYPE.FRONT_COVER:
            return { ...state, viewState: FORM_TYPE.FRONT_COVER, formData: payload  };
        case FORM_TYPE.BACK_COVER:
            return { ...state, viewState: FORM_TYPE.BACK_COVER, formData: payload  };
        case FORM_TYPE.CHAPTER:
            return { ...state, viewState: FORM_TYPE.CHAPTER, formData: payload  };
        case FORM_TYPE.PAGE:
            return { ...state, viewState: FORM_TYPE.PAGE, formData: payload  };
        case FORM_TYPE.SECTION: 
            return { ...state, viewState: FORM_TYPE.SECTION, formData: payload };
        case FORM_TYPE.SUB_SECTION:
            return { ...state, viewState: FORM_TYPE.SUB_SECTION, formData: payload  };
        case FORM_TYPE.CREATE_UPDATE:
            return { ...state, viewState: FORM_TYPE.CREATE_UPDATE, formData: payload  };
        case FORM_TYPE.NONE:
            return { ...state, viewState: FORM_TYPE.NONE, formData: payload  };
        case FORM_TYPE.UPDATE:
                return { ...state, viewState: FORM_TYPE.UPDATE, formData: payload  };
        default:
            throw new Error(`Unknown type: ${action.viewType}`);
    }
}

const setActivePage = (state: any, action: any) => {
    const { service } = state;
    const { data } = service;
    const { pageId, sectionId } = action;
    let __state = state;
    if (action.sectionId && action.pageId) {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                page.child.forEach((section: any) => {
                    if (section.uniqueId === sectionId) {
                        const { child, ...others } = section;
                        __state = { ...state, activePage: section, viewData: others, hideSection: false, viewState: FORM_TYPE.NONE };
                    }
                })
            }
        });
    } else {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                const { child, ...others } = page;
                __state = { ...state, activePage: page, viewData: others, hideSection: true, viewState: FORM_TYPE.NONE };
            }
        });
    }

    return __state;
}

const setApiState = (state: any, action: any) => {
    const { status, payload } = action;
    switch (status) {
        case 'SUCCESS':
          return { ...state, apiData: payload, apiState: 'SUCCESS' };

        case 'ERROR':
            return { ...state, err: payload, apiState: 'ERROR' };      

        case 'INIT':
            return state;
            
        default:
            throw new Error(`Unknown type: ${action.status}`);
    }
}

const reducer = (state: any, action: any) => {
    const { type, payload } = action;
    
    switch (type) {
        case BOOK_SERVICE.API_STATE:
          return setApiState(state, action);
        case BOOK_SERVICE.API_DATA:
            return { ...state, data: payload };     
        case BOOK_SERVICE.SETTER:
            return setter(state, action);
        case BOOK_SERVICE.FORM_PAGE_SETTER: 
            return formPageSetter(state, action);
        case BOOK_SERVICE.ACTIVE_PAGE:
            return setActivePage(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export default function BookServiceProvider(props: { children: object }){
    const [state, dispatch] = useReducer(reducer, bookState);
    const { bookId } = state;
    
    useEffect(() => {
        if (bookId) {
            fetchData(state, dispatch);
        }
    },[bookId, state]);

    return (
        <BookContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};
