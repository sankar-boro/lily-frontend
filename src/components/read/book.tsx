import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Book, sortAll, activeChBg, activeScBg, displayNone } from "./util";

const LeftComponent = (props: any) => {
    const { title, setActiveId, allPages, setSectionId, activeId, sectionId } =
        props;
    const doSome = (data: any) => {
        let child = [];
        if (data && data.child && Array.isArray(data.child)) {
            child = data.child;
        }

        return {
            chapter: data,
            sections: child,
        };
    };
    return (
        <div>
            {allPages.map((value: any, index: number) => {
                const { chapter, sections } = doSome(value);
                return (
                    <div key={chapter.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(chapter.uniqueId);
                                setSectionId(null);
                            }}
                            className="chapter-nav"
                            style={activeChBg(chapter, activeId)}
                        >
                            {chapter.title}
                        </div>
                        <div style={displayNone(chapter, activeId)}>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSectionId(c.uniqueId);
                                        }}
                                        key={c.uniqueId}
                                        style={{
                                            marginLeft: 15,
                                            ...activeScBg(c, sectionId),
                                        }}
                                        className="section-nav"
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

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
                        sectionId={sectionId}
                        activeId={activeId}
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
        <div className="container">
            <div className="col-8">
                <h3>{thisData.title}</h3>
                <div>{thisData.body}</div>
                {sectionId &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: Book) => {
                        return (
                            <div key={x.uniqueId}>
                                <h4>{x.title}</h4>
                                <div>{x.body}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="col-4">Divider</div>
        </div>
    );
};

export default ViewBook;
