import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Form101 from "./forms/Form101";
import Form102 from "./forms/Form102";
import Form103 from "./forms/Form103";
import Form104 from "./forms/Form104";
import Form105 from "./forms/Form105";
import Form106 from "./forms/Form106";
import { sortAll, Book } from "./util";
import { BookNavigation } from "./BookNavigation";
import "./edit.css";

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
                    <BookNavigation
                        title={title}
                        allPages={allPages}
                        setActiveId={setActiveId}
                        setLevel={setLevel}
                        setSectionId={callMe}
                        setCurrentFormType={setCurrentFormType}
                        activeId={activeId}
                        sectionId={sectionId}
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
        currentFormType,
    } = props;
    let thisData = currentData;
    if (sectionId && currentData.child && currentData.child.length > 0) {
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }

    if (currentFormType === 105) {
        return <Form105 {...props} />;
    }
    return (
        <div className="container">
            <div className="col-8">
                {/* <div
                    onClick={(e) => {
                        e.preventDefault();
                        setEditTitle(thisData.title);
                        setEditBody(thisData.body);
                        setCurrentFormType(102);
                    }}
                >
                    Edit
                </div> */}
                <h3>{thisData.title}</h3>
                <div>{thisData.body}</div>
                {sectionId &&
                    thisData &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: any) => {
                        return (
                            <div key={x.uniqueId}>
                                {/* <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEditTitle(x.title);
                                        setEditBody(x.body);
                                        setCurrentFormType(102);
                                    }}
                                >
                                    Edit
                                </div> */}
                                <h4>{x.title}</h4>
                                <div>{x.body}</div>
                            </div>
                        );
                    })}
                {sectionId && (
                    <div>
                        <Form106
                            {...props}
                            sectionProps={{
                                sectionId,
                                sectionChildren:
                                    (thisData && thisData.child) || [],
                            }}
                        />
                    </div>
                )}
            </div>
            {/* <div className="col-4">{editTitle && <Form {...props} />}</div> */}
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
