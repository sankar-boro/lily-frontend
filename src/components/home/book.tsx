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
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveId(someData.uniqueId);
                            // setSectionId(null);
                        }}
                        key={someData.title}
                    >
                        {someData.title}
                        {someData.child &&
                            someData.child.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSectionId(c.uniqueId);
                                        }}
                                        key={c.uniqueId}
                                    >
                                        t {c.title}
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
    newData.forEach((d: any) => {
        let child = d.child;
        child.forEach((c: any) => {
            c["child"] = [];
            data.forEach((dd: any) => {
                if (dd.parentId === c.uniqueId) {
                    c.child.push(dd);
                }
            });
        });
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
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }
    // console.log(thisData);
    console.log(thisData.title);
    return (
        <>
            <div>{thisData.title}</div>
            <div>{thisData.body}</div>
            {thisData.child &&
                thisData.child.length > 0 &&
                thisData.child.map((x: any) => {
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
