import React, { useContext, useEffect, useReducer } from "react";
import { sortAll } from "../globals/forms/index";
import { FORM_TYPE, ID_TYPES, Book } from "../globals/types";
import { BookService, BookHandler } from "./handlers/BookService";

export type BookState = {
    data: any;
    service: BookService;
    bookId: string;
    editSubSectionId: string;
    parentId: string;
    formData: object;
    activePage: Book[] | null;
    activeSection: null;
    apiState: string | null;
    error: string;
    dispatch: Function,
    viewState: string,
};

const bookState = {
    data: null,
    bookId: '',
    editSubSectionId: '',
    parentId: '',
    formData: {},
    activePage: null,
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
    service: new BookHandler(),
}

export const BookContext = React.createContext<BookState>({
    data: null,
    service: new BookHandler(),
    bookId: '',
    editSubSectionId: '',
    parentId: '',
    formData: {},
    activePage: [],
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
});

export const useBookContext = () => useContext(BookContext);

const fetchData = (state: BookState, dispatch: Function) => {
    const { apiState, service, bookId } = state;
    // We only want this function to be performed once
    if (apiState) return;
    dispatch({
        ...state,
        type: 'INIT',
    });
    service.fetch(bookId).then((context: any) => {
        let res = context.map_res().data;
        let bookData = sortAll(res);
        dispatch({
            ...state,
            type: 'SUCCESS',
            payload: bookData,
        });
        dispatch({
            type: 'ACTIVE_PAGE',
            pageId: state.bookId,
            sectionId: null,
        });
        // setActiveId(bookData, state.bookId, dispatch);
    })
}

const idSetter = (state: any, action: any) => {
    const { payload } = action;
    switch (action.idType) {
        case ID_TYPES.BOOK:
            return { ...state, bookId: payload };
        case ID_TYPES.ACTIVE:
            return { ...state, activeId: payload };
        case ID_TYPES.SECTION:
            return { ...state, sectionId: payload };
        case ID_TYPES.PARENT:
            return { ...state, parentId: payload };
        case ID_TYPES.FORM: 
            return { ...state, formData: payload };
        default:
            throw new Error(`Unknown type: ${action.idType}`);
    }
}

const formPageViewSetter = (state: any, action: any) => {
    switch (action.viewType) {
        case FORM_TYPE.FRONT_COVER:
            return { ...state, viewState: FORM_TYPE.FRONT_COVER };
        case FORM_TYPE.BACK_COVER:
            return { ...state, viewState: FORM_TYPE.BACK_COVER };
        case FORM_TYPE.CHAPTER:
            return { ...state, viewState: FORM_TYPE.CHAPTER };
        case FORM_TYPE.PAGE:
            return { ...state, viewState: FORM_TYPE.PAGE };
        case FORM_TYPE.SECTION: 
            return { ...state, viewState: FORM_TYPE.SECTION};
        case FORM_TYPE.SUB_SECTION:
            return { ...state, viewState: FORM_TYPE.SUB_SECTION };
        case FORM_TYPE.CREATE_UPDATE:
            return { ...state, viewState: FORM_TYPE.CREATE_UPDATE };
        case FORM_TYPE.NONE:
            return { ...state, viewState: FORM_TYPE.NONE };
        default:
            throw new Error(`Unknown type: ${action.viewType}`);
    }
}

const formPageUpdateSetter = (state: any, action: any) => {

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
                        __state = { ...state, activePage: section };
                    }
                })
            }
        });
    } else {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                __state = { ...state, activePage: page };
            }
        });
    }

    return __state;
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'INIT':
          return { ...state, apiState: 'INIT' };
    
        case 'FETCHING':
          return { ...state, apiState: 'FETCHING' };
    
        case 'SUCCESS':
          return { ...state, data: action.payload, apiState: 'SUCCESS' };
    
        case 'ERROR':
          return { ...state, apiError: action.payload, apiState: 'ERROR' };

        case 'ID_SETTER':
            return idSetter(state, action);

        case 'FORM_VIEW_SETTER': 
            return formPageViewSetter(state, action);
        
        case 'FORM_UPDATE_SETTER': 
            return formPageUpdateSetter(state, action);
        
        case 'ACTIVE_PAGE':
            return setActivePage(state, action);

        case 'ACTIVE_SECTION':
            return { ...state, activeSection: action.payload };
            
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
