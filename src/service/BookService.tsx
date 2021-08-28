import axios, { AxiosError, AxiosResponse } from "axios";
import { FORM_TYPE, ID_TYPES, Book } from "../globals/types";
import { sortAll } from "../globals/forms/index";
import { resolve } from "url";

interface BookService {
    readonly data: any[];
    readonly err: any;
    payload: any;

    fetch(bookId: string): any;
    map_res(): any;
    map_err(): any;
}

const getAllBookData = async (url: string) => {
    return await axios.get(url, {
        withCredentials: true,
    });
}

class BookHandler implements BookService {
    data = [];
    err: any;
    payload: any;

    fetch(bookId: string): Promise<any> {
        const prefix = "http://localhost:8000/book/getall/";
        const url = `${prefix}${bookId}`;
        return new Promise(async (resolve, reject) => {
            getAllBookData(url)
            .then((res) => {
                this.payload = res;
                resolve(this);
            })
            .catch((err) => {
                this.err = err;
                reject(this);
            });
        });
    }
    
    map_res(): any {
        const { payload } = this;
        const { status, data } = payload;
        if (status && data && status === 200) {
            this.data = data;
        }
        return this;
    }

    map_err(): any {
        return this;
    }
}

export type { BookService };
export { BookHandler } ;