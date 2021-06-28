import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const LeftComponent = (props: any) => {
    const { title, setActiveId, allPages, setSectionId } = props;
    let someView = [];
    return (
        <div>
            {Object.entries(allPages).map((value: any, index: number) => {
                let someData = value[1];
                return (
                    <div key={someData.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(someData.uniqueId);
                                setSectionId(null);
                            }}
                            className="chapter-nav"
                        >
                            {someData.title}
                        </div>
                        {someData.child &&
                            someData.child.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSectionId(c.uniqueId);
                                        }}
                                        className="chapter-nav"
                                        key={c.uniqueId}
                                        style={{ marginLeft: 15 }}
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
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
    parentId: string | null;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
};

function sortAll(data: Book[], parentId: string) {
    let lastParentId = parentId;
    let newData: any = [];
    data.forEach((b) => {
        if (b.identity === 101) {
            newData.push({ ...b });
        }
    });
    data.forEach((d) => {
        if (d.identity === 104) {
            newData.push({ ...d, child: [] });
        }
    });
    data.forEach((d) => {
        if (d.identity === 105) {
            newData.forEach((n: any) => {
                if (n.uniqueId === d.parentId) {
                    n.child.push({ ...d, child: [] });
                }
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                c["child"] = [];
                data.forEach((dd: any) => {
                    if (dd.parentId === c.uniqueId) {
                        c.child.push(dd);
                    }
                });
            });
        }
    });
    return newData;
}

const ViewBook = () => {
    const history: {
        location: {
            state: Book;
        };
    } = useHistory();

    const { location } = history;
    const { state } = location;
    const { title, body, bookId } = state;
    const [allPages, setAllPages] = useState<any>([]);
    const [activeId, setActiveId] = useState<string>(bookId);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [level, setLevel] = useState(1);
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
                    let dataRes: Book[] = res.data;
                    // console.log("res", res);
                    // let a = [state];
                    let x = sortAll(dataRes, bookId);
                    // x.forEach((x: any) => {
                    //     a.push(x);
                    // });
                    setAllPages(x);
                }
            })
            .catch((err: AxiosError<any>) => {
                console.log("deleteerror", err.response);
            });
    }, []);

    const callMe = (bc: any) => {
        setSectionId(bc);
    };

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
                        setLevel={setLevel}
                        setSectionId={callMe}
                    />
                }
                bookId={bookId}
                allPages={allPages}
            >
                <RenderBody currentData={currentData} sectionId={sectionId} />
            </BodyComponent>
        );
    }

    return null;
};

const RenderBody = (props: any) => {
    const { currentData, sectionId } = props;
    let thisData = currentData;
    if (sectionId && currentData.child && currentData.child.length > 0) {
        currentData.child.forEach((a: Book) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }
    return (
        <>
            <div>{thisData.title}</div>
            <div>{thisData.body}</div>
            {sectionId &&
                thisData.child &&
                thisData.child.length > 0 &&
                thisData.child.map((x: Book) => {
                    return (
                        <div key={x.uniqueId}>
                            <div>{x.title}</div>
                            <div>{x.body}</div>
                        </div>
                    );
                })}
        </>
    );
};

export default ViewBook;
