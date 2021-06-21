import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const LeftComponent = (props: any) => {
    const { title, setActiveId, allPages } = props;
    let someView = [];
    return (
        <div>
            {Object.entries(allPages).map((value: any, index: number) => {
                let someData = value[1];
                return (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveId(someData.uniqueId);
                        }}
                        key={someData.title}
                    >
                        {someData.title}
                    </div>
                );
            })}
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
    let newData: any = [];
    data.forEach((b) => {
        if (b.parentId === lastParentId && b.identity === 1) {
            newData.push({ ...b, child: [] });
        }
    });
    data.forEach((d) => {
        if (d.identity === 2) {
            newData.forEach((n: any) => {
                if (n.uniqueId === d.parentId) {
                    n.child.push(d);
                }
            });
        }
    });
    return newData;
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
    const { title, description: body, bookId } = state;
    const [allPages, setAllPages] = useState<any>([]);
    const [activeId, setActiveId] = useState<string>(bookId);
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
                    let a = [{ title, body, uniqueId: bookId }];
                    let x = sortAll(res.data, bookId);
                    x.forEach((x: any) => {
                        a.push(x);
                    });
                    setAllPages(a);
                }
            })
            .catch((err: AxiosError<any>) => {
                console.log("deleteerror", err.response);
            });
    }, []);

    if (allPages && allPages.length > 0) {
        let currentData: { title: string; body: string } = {
            title: "",
            body: "",
        };
        allPages.forEach((a: any) => {
            if (activeId === a.uniqueId) {
                currentData = a;
            }
        });
        return (
            <BodyComponent
                leftComponent={
                    <LeftComponent
                        title={title}
                        allPages={allPages}
                        setActiveId={setActiveId}
                    />
                }
            >
                <div>{currentData.title}</div>
                <div>{currentData.body}</div>
            </BodyComponent>
        );
    }

    return null;
};

export default ViewBook;
