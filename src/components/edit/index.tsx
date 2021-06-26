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
            <div>Add new Page</div>
            <div>Add new Chapter</div>
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
        currentData.child.forEach((a: any) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }
    const [current, setCurrent] = useState<any | null>(null);

    return (
        <div className="flex-container">
            <div className="c-left">
                <div>{thisData.title}</div>
                <div>{thisData.body}</div>
                {sectionId &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: any) => {
                        return (
                            <div key={x.uniqueId}>
                                <div>{x.title}</div>
                                <div>{x.body}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="c-right">
                {current && <Form current={current} />}
            </div>
        </div>
    );
};

const Form = (props: any) => {
    const { current } = props;
    return (
        <form action="#" method="post">
            <input
                type="text"
                placeholder="Title"
                name="title"
                required
                onChange={(e) => {
                    e.preventDefault();
                    // setTitle(e.target.value);
                }}
                value={current && current.title}
            />
            <br />
            <textarea
                id="body"
                name="Body"
                rows={12}
                cols={50}
                onChange={(e) => {
                    e.preventDefault();
                    // setBody(e.target.value);
                }}
                placeholder="Body of your document."
                value={current && current.body}
            />
            <br />
            <input
                className="new-doc-submit-btn"
                type="button"
                value="Submit"
                onClick={(e) => {
                    e.preventDefault();
                    // submitDocument();
                }}
            />
        </form>
    );
};

export default EditBook;
