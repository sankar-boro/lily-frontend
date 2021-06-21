import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const LeftComponent = (props: any) => {
    const { title } = props;
    return (
        <div>
            {title}
            <hr />
        </div>
    );
};

type Book = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    parentId: string;
    uniqueId: string;
};

function sortAll(data: Book[], parentId: string) {
    let lastParentId = parentId;
    let newData: any = {};
    data.forEach((b) => {
        if (b.parentId === lastParentId && b.identity === 1) {
            newData[b.uniqueId] = { title: b.title, child: [] };
        }
    });
    console.log(newData);
    data.forEach((d) => {
        if (d.identity === 2) {
            newData[d.parentId].child.push({ title: d.title });
        }
    });
}

const ViewBook = () => {
    const history: {
        location: {
            state: {
                bookId: string;
                authorId: string;
                title: string;
                description: string;
            };
        };
    } = useHistory();

    const { location } = history;
    const { state } = location;
    const { title, description, bookId } = state;
    const [allPages, setAllPages] = useState([]);
    useEffect(() => {
        axios
            .get(`http://localhost:8000/book/getall/${bookId}`, {
                withCredentials: true,
            })
            .then((res: AxiosResponse<any>) => {
                if (
                    res.status &&
                    typeof res.status === "number" &&
                    res.status === 200
                ) {
                    console.log("res", res);
                    sortAll(res.data, bookId);
                }
            })
            .catch((err: AxiosError<any>) => {
                console.log("deleteerror", err.response);
            });
    });
    return (
        <BodyComponent leftComponent={<LeftComponent title={title} />}>
            <div>{title}</div>
            <div>{description}</div>
        </BodyComponent>
    );
};

export default ViewBook;
