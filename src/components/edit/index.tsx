import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Form101 from "./Form101";
import Form102 from "./Form102";

const LeftComponent = (props: any) => {
    const { title, setCurrentFormType } = props;
    return (
        <div>
            {title}
            <hr />
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(101);
                }}
            >
                Add new Page
            </div>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(101);
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
    title: string;
    body: string;
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

    const { location } = history;
    const { state } = location;
    const { title, body, bookId } = state.main;
    const [allPages, setAllPages] = useState(state.allPages);
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
    return null;
};

export default EditBook;
