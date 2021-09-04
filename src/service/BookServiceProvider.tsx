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
    viewData: object;
    activePage: Book[] | null;
    hideSection: boolean;
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
    viewData: {},
    activePage: null,
    hideSection: true,
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
    viewData: {},
    activePage: [],
    hideSection: true,
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
                        __state = { ...state, activePage: section, viewData: section, hideSection: false, viewState: FORM_TYPE.NONE };
                    }
                })
            }
        });
    } else {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                __state = { ...state, activePage: page, viewData: page, hideSection: true, viewState: FORM_TYPE.NONE };
            }
        });
    }

    return __state;
}

const setApiState = (state: any, action: any) => {
    const { status, payload } = action;
    switch (status) {
        case 'SUCCESS':
          return { ...state, data: payload, apiState: 'SUCCESS' };

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
        case 'API_STATE':
          return setApiState(state, action);

        case 'API_DATA':
            return { ...state, data: payload };      

        case 'ID_SETTER':
            return idSetter(state, action);

        case 'FORM_PAGE_SETTER': 
            return formPageSetter(state, action);
        
        case 'ACTIVE_PAGE':
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
