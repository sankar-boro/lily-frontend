import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Form101 from "./Form101";
import Form102 from "./Form102";
import Form103 from "./Form103";
import Form104 from "./Form104";
import Form105 from "./Form105";
import Form106 from "./Form106";

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

const LeftComponent = (props: any) => {
    const { title, setCurrentFormType } = props;
    return (
        <div>
            {title}
            <hr />
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(103);
                }}
            >
                Add new Page
            </div>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(104);
                }}
            >
                Add new Chapter
            </div>
        </div>
    );
};
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
const EditBook = () => {
    const history: {
        location: {
            state: {
                main: Book;
                allPages: Book[];
            };
        };
    } = useHistory();
    console.log(history.location.state);
    const { location } = history;
    const { state } = location;
    const { title, body, bookId } = state.main;
    const [allPages, setAllPages] = useState(sortAll(state.allPages, bookId));
    const [activeId, setActiveId] = useState<string>(bookId);
    const [level, setLevel] = useState(1);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState<string | null>(null);
    const [editBody, setEditBody] = useState<string | null>(null);
    const [currentFormType, setCurrentFormType] = useState<number | null>(null);

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
                        setCurrentFormType={setCurrentFormType}
                    />
                }
                bookId={bookId}
                allPages={allPages}
            >
                <RenderBody
                    currentData={currentData}
                    sectionId={sectionId}
                    setEditTitle={setEditTitle}
                    setEditBody={setEditBody}
                    editTitle={currentData.title}
                    editBody={currentData.body}
                    currentFormType={currentFormType}
                    setCurrentFormType={setCurrentFormType}
                    allPages={allPages}
                    bookId={bookId}
                />
            </BodyComponent>
        );
    }

    return null;
};

const RenderBody = (props: any) => {
    const {
        currentData,
        sectionId,
        setEditTitle,
        setEditBody,
        editTitle,
        setCurrentFormType,
    } = props;
    let thisData = currentData;
    if (sectionId && currentData.child && currentData.child.length > 0) {
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }
    return (
        <div className="flex-container">
            <div className="c-left">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        setEditTitle(thisData.title);
                        setEditBody(thisData.body);
                        setCurrentFormType(102);
                    }}
                >
                    Edit
                </div>
                <div>{thisData.title}</div>
                <div>{thisData.body}</div>
                {sectionId &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: any) => {
                        return (
                            <div key={x.uniqueId}>
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEditTitle(x.title);
                                        setEditBody(x.body);
                                        setCurrentFormType(102);
                                    }}
                                >
                                    Edit
                                </div>
                                <div>{x.title}</div>
                                <div>{x.body}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="c-right">{editTitle && <Form {...props} />}</div>
        </div>
    );
};

const Form = (props: any) => {
    const { currentFormType } = props;
    if (currentFormType === 101) {
        return <Form101 {...props} />;
    }

    if (currentFormType === 102) {
        return <Form102 {...props} />;
    }
    if (currentFormType === 103) {
        return <Form103 {...props} />;
    }
    if (currentFormType === 104) {
        return <Form104 {...props} />;
    }
    if (currentFormType === 105) {
        return <Form105 {...props} />;
    }
    if (currentFormType === 106) {
        return <Form106 {...props} />;
    }
    return null;
};

export default EditBook;
