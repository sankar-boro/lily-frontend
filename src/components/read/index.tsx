import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Book, sortAll } from "./util";
import ReadBookNavigation from "./ReadBookNavigation";
import { useAuthContext } from "../../service/AuthServiceProvider";

const ViewBook = () => {
    const history: {
        location: {
            state: Book;
        };
    } = useHistory();
    const context = useAuthContext();

    const { location } = history;
    const { state } = location;
    const { title, bookId } = state;
    const [allPages, setAllPages] = useState<any>([]);
    const [activeId, setActiveId] = useState<string>(bookId);
    const [sectionId, setSectionId] = useState<string | null>(null);
    useEffect(() => {
        context.setRead(true);
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
                    let x = sortAll(dataRes);
                    setAllPages(x);
                }
            })
            .catch((err: AxiosError<any>) => {
                // console.log("deleteerror", err.response);
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
                    <ReadBookNavigation
                        title={title}
                        allPages={allPages}
                        setActiveId={setActiveId}
                        setSectionId={callMe}
                        sectionId={sectionId}
                        activeId={activeId}
                    />
                }
                bookId={bookId}
                allPages={allPages}
                header={title}
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
        <div className="sm-container">
            <div className="col-8" style={{backgroundColor:"red"}}>
                <h3>{thisData.title}</h3>
                <div className="description">{thisData.body}</div>
                {sectionId &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: Book) => {
                        return (
                            <div key={x.uniqueId}>
                                <h4>{x.title}</h4>
                                <div className="description">{x.body}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="col-4" style={{backgroundColor:"blue"}}>Divider</div>
        </div>
    );
};

export default ViewBook;
