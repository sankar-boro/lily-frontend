import React, { useContext, useEffect, useState, useReducer } from "react";
import { Option, None, Some } from "ts-results";
import axios, { AxiosError, AxiosResponse } from "axios";
import { sortAll } from "../globals/forms/index";

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
    data: Book[];
    bookId: string;
    activeId: string;
    sectionId: string;
    activePage: Book[];
    activeSection: null;
    apiState: string | null;
    error: string;
    dispatch: Function,
};

const bookState = {
    data: [],
    bookId: '',
    activeId: '',
    sectionId: '',
    activePage: [],
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
}
export const BookContext = React.createContext<BookState>({
    data: [],
    bookId: '',
    activeId: '',
    sectionId: '',
    activePage: [],
    activeSection: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
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

    switch (action.idType) {
        case 'BOOK_ID':
            return { ...state, bookId: action.payload };

        case 'ACTIVE_ID':
            return { ...state, activeId: action.payload };
                
        case 'SECTION_ID':
            return { ...state, sectionId: action.payload };
    
        default:
            throw new Error(`Unknown type: ${action.idType}`);
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