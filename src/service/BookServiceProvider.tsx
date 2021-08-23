import React, { useContext, useEffect, useState, useReducer } from "react";
import { Option, None, Some } from "ts-results";
import axios, { AxiosError, AxiosResponse } from "axios";
import { sortAll } from "../globals/forms/index";
import { VIEW_TYPE, ID_TYPES } from "../globals/types";

type Book = {
    bookId: string;
    authorId: string;
    authorName: string;
    title: string;
    body: string;
    parentId: string;
    uniqueId: string;
    createdAt: string;
    updatedAt: string;
    identity: number;
};

export type BookState = {
    data: any;
    bookId: string;
    activeId: string;
    sectionId: string;
    parentId: string;
    formData: object;
    activePage: Book[];
    activeSection: null;
    apiState: string | null;
    error: string;
    dispatch: Function,
    viewState: string,
};

const bookState = {
    data: [],
    bookId: '',
    activeId: '',
    sectionId: '',
    parentId: '',
    formData: {},
    activePage: [],
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: VIEW_TYPE.NONE,
}

export const BookContext = React.createContext<BookState>({
    data: [],
    bookId: '',
    activeId: '',
    sectionId: '',
    parentId: '',
    formData: {},
    activePage: [],
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: VIEW_TYPE.NONE,
});

export const useBookContext = () => useContext(BookContext);

const fetchData = (state: BookState, dispatch: Function) => {
    const { apiState } = state;
    // We only want this function to be performed once
    if (apiState) return;

    dispatch({
        ...state,
        type: 'INIT',
    });
    axios
    .get(`http://localhost:8000/book/getall/${state.bookId}`, {
        withCredentials: true,
    })
    .then((res: AxiosResponse<any>) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            let dataRes: Book[] = res.data;
            let a = sortAll(dataRes);
            console.log(a);
            dispatch({
                ...state,
                type: 'SUCCESS',
                payload: a,
            });
            setActiveId(a, state.bookId, dispatch);
        }
    })
    .catch((err: AxiosError<any>) => {
        dispatch({
            ...state,
            type: 'ERROR',
            payload: err.message,
        });
    });
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

const viewSetter = (state: any, action: any) => {
    switch (action.viewType) {
        case VIEW_TYPE.FRONT_COVER:
            return { ...state, viewState: VIEW_TYPE.FRONT_COVER };
        case VIEW_TYPE.BACK_COVER:
            return { ...state, viewState: VIEW_TYPE.BACK_COVER };
        case VIEW_TYPE.CHAPTER:
            return { ...state, viewState: VIEW_TYPE.CHAPTER };
        case VIEW_TYPE.PAGE:
            return { ...state, viewState: VIEW_TYPE.PAGE };
        case VIEW_TYPE.SECTION: 
            return { ...state, viewState: VIEW_TYPE.SECTION};
        case VIEW_TYPE.SUB_SECTION:
            return { ...state, viewState: VIEW_TYPE.SUB_SECTION };
        case VIEW_TYPE.CREATE_UPDATE:
            return { ...state, viewState: VIEW_TYPE.CREATE_UPDATE };
        case VIEW_TYPE.NONE:
            return { ...state, viewState: VIEW_TYPE.NONE };
        default:
            throw new Error(`Unknown type: ${action.viewType}`);
    }
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

        case 'VIEW_SETTER': 
            return viewSetter(state, action);
        
        case 'ACTIVE_PAGE':
            return { ...state, activePage: action.payload };

        case 'ACTIVE_SECTION':
            return { ...state, activeSection: action.payload };
            
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

const setActiveId = (data: any, activeId: string, dispatch: Function) => {
    data.forEach((a: any) => {
        if (activeId === a.uniqueId) {
            dispatch({
                payload: a,
                type: 'ACTIVE_PAGE'
            });
        }
    });
}

const setSectionId = (data: any, sectionId: string, dispatch: Function, activePage: any) => {
    if (sectionId && activePage.child && activePage.child.length > 0) {
        activePage.child.forEach((a: Book) => {
            if (a.uniqueId === sectionId) {
                dispatch({
                    payload: a,
                    type: 'ACTIVE_SECTION'
                });
            }
        });
    }
}

export default function BookServiceProvider(props: { children: object }){
    const [state, dispatch] = useReducer(reducer, bookState);
    const { bookId, activeId, data, sectionId, activePage } = state;
    
    useEffect(() => {
        if (bookId) {
            fetchData(state, dispatch);
        }
        if (activeId) {
            setActiveId(data, activeId, dispatch);
        }

        if (sectionId) {
            setSectionId(data, sectionId, dispatch, activePage);
        }
    },[bookId, activeId, sectionId]);

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
