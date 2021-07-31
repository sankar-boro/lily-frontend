import { useState } from "react";
import { None } from "ts-results";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Book } from "./util";
import CreateBook from "../forms/CreateNewBook";
import { Form, FormType, sortAll } from "./util";
import CreateBodyComponent from "./BodyComponent";
import { EditBookNavigation } from "./BookNavigation";

import Form102 from "../forms/Form102";
import Form103 from "../forms/Form103";
import Form104 from "../forms/Form104";
import Form105 from "../forms/Form105";
import Form106 from "../forms/Form106";
import Form107 from "../forms/Form107";

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
    // const { state } = location;
    // const { title, bookId } = state.main;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [bookId, setBookId] = useState<string | null>(null);
    const [bookRows, setBookRows] = useState([]);
    const [allPages, setAllPages] = useState<Book[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [parentId, setParentId] = useState<string | null>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [currentFormType, setCurrentFormType] = useState<Form>({
        formType: FormType.FRONT_COVER,
        formData: None,
    });

    const callMe = (bc: any) => {
        setSectionId(bc);
    };

    useEffect(() => {
        let pages = sortAll(bookRows);
        setAllPages(pages);
    }, [bookRows]);

    return (
        <CreateBodyComponent
            leftComponent={
                <EditBookNavigation
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
                sectionId={sectionId}
                currentFormType={currentFormType}
                setCurrentFormType={setCurrentFormType}
                allPages={allPages}
                bookId={bookId}
                parentId={parentId}
                activeId={activeId}
                setBookRows={setBookRows}
                bookRows={bookRows}
            />
        </CreateBodyComponent>
    );
};

const RenderBody = (props: {
    sectionId: string | null;
    currentFormType: Form;
    setCurrentFormType: Function;
    allPages: any;
    bookId: string | null;
    parentId: string | null;
    activeId: string | null;
    setBookRows: Function;
    bookRows: Book[];
}) => {
    const { sectionId, currentFormType, allPages, activeId } = props;
    let currentData: any = null;
    allPages.forEach((a: any) => {
        if (activeId === a.uniqueId) {
            currentData = a;
        }
    });
    let thisData = currentData;
    if (sectionId && currentData.child && currentData.child.length > 0) {
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }

    if (currentFormType.formType !== FormType.NONE) {
        return FormView(props);
    }

    if (currentData === null) return null;

    return (
        <div className="lg-container">
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
    sectionId: string | null;
    currentFormType: Form;
    setCurrentFormType: Function;
    allPages: any;
    bookId: string | null;
    parentId: string | null;
    activeId: string | null;
    setBookRows: Function;
    bookRows: Book[];
}) => {
    const { currentFormType } = props;
    if (currentFormType.formType === FormType.FRONT_COVER) {
        return <CreateBook {...props} />;
    }
    if (currentFormType.formType === FormType.BACK_COVER) {
        return <Form102 {...props} />;
    }
    if (currentFormType.formType === FormType.PAGE) {
        return <Form103 {...props} />;
    }
    if (currentFormType.formType === FormType.CHAPTER) {
        return <Form104 {...props} />;
    }
    if (currentFormType.formType === FormType.SECTION) {
        return <Form105 {...props} />;
    }
    if (currentFormType.formType === FormType.SUB_SECTION) {
        return <Form106 {...props} />;
    }
    if (currentFormType.formType === FormType.CREATE_UPDATE) {
        return <Form107 {...props} />;
    }
    return null;
};

export default EditBook;
