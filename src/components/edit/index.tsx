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
import Form107 from "./forms/Form107";
import { sortAll, Book } from "./util";
import { BookNavigation } from "./BookNavigation";
import "./edit.css";
import { Some, Option, None } from "ts-results";
import { Form } from "./util";

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
    const [parentId, setParentId] = useState<string | null>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [currentFormType, setCurrentFormType] = useState<Form>({
        formType: 404,
        formData: None,
    });

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
                        setSectionId={callMe}
                        setCurrentFormType={setCurrentFormType}
                        activeId={activeId}
                        sectionId={sectionId}
                        setParentId={setParentId}
                    />
                }
                bookId={bookId}
                allPages={allPages}
            >
                <RenderBody
                    currentData={currentData}
                    sectionId={sectionId}
                    currentFormType={currentFormType}
                    setCurrentFormType={setCurrentFormType}
                    allPages={allPages}
                    bookId={bookId}
                    parentId={parentId}
                />
            </BodyComponent>
        );
    }

    return null;
};

const RenderBody = (props: {
    currentData: any;
    sectionId: string | null;
    currentFormType: Form;
    setCurrentFormType: Function;
    allPages: any;
    bookId: string;
    parentId: string | null;
}) => {
    console.log("RenderBody", props.bookId);
    const { currentData, sectionId, currentFormType } = props;
    let thisData = currentData;
    if (sectionId && currentData.child && currentData.child.length > 0) {
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }

    if (currentFormType.formType !== 404) {
        return FormView(props);
    }
    return (
        <div className="container">
            <div className="col-8">
                <h3>{thisData.title}</h3>
                <div>{thisData.body}</div>
                {sectionId &&
                    thisData &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: any) => {
                        return (
                            <div key={x.uniqueId}>
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
        </div>
    );
};

const FormView = (props: {
    currentFormType: Form;
    allPages: any;
    bookId: string;
    parentId: string | null;
}) => {
    const { currentFormType } = props;
    if (currentFormType.formType === 101) {
        return <Form101 {...props} />;
    }

    if (currentFormType.formType === 102) {
        return <Form102 {...props} />;
    }
    if (currentFormType.formType === 103) {
        return <Form103 {...props} />;
    }
    if (currentFormType.formType === 104) {
        return <Form104 {...props} />;
    }
    if (currentFormType.formType === 105) {
        return <Form105 {...props} />;
    }
    if (currentFormType.formType === 106) {
        return <Form106 {...props} />;
    }
    if (currentFormType.formType === 107) {
        return <Form107 {...props} />;
    }
    return null;
};

export default EditBook;
