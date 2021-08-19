import { useHistory } from "react-router-dom";
import Divider from "./Divider";
import Form101 from "../edit";
import Form102 from "../edit";
import Form103 from "../edit";
import Form104 from "../edit";
import Form105 from "../edit";
import Form106 from "../edit";
import Form107 from "../edit";
import { Book, VIEW_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const Main = (props: any) => {
    const { title, thisData, sectionId } = props;
    return (
        <div style={{width:"82%"}}>
            <div style={{display: "flex"}}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}></div>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div className="con-4">
                    <h3 className="h3" style={{marginBottom: 15 }}>{thisData.title}</h3>
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
                <Divider />
            </div>
        </div>
    );
}

const FormView = () => {
    const context: any = useBookContext();

    if (context.viewState === VIEW_TYPE.FRONT_COVER) {
        return <Form101 />;
    }

    if (context.viewState === VIEW_TYPE.BACK_COVER) {
        return <Form102 />;
    }
    if (context.viewState === VIEW_TYPE.PAGE) {
        return <Form103 />;
    }
    if (context.viewState === VIEW_TYPE.CHAPTER) {
        return <Form104 />;
    }
    if (context.viewState === VIEW_TYPE.SECTION) {
        return <Form105 />;
    }
    if (context.viewState === VIEW_TYPE.SUB_SECTION) {
        return <Form106 />;
    }
    if (context.viewState === VIEW_TYPE.CREATE_UPDATE) {
        return <Form107 />;
    }
    return null;
};

const BodyRenderer = (props: any) => {
    const history: any = useHistory();
    const { title } = history.location.state;
    const context: any = useBookContext();
    const { activePage, sectionId } = context;
    let thisData = activePage;
    if (sectionId && activePage.child && activePage.child.length > 0) {
        activePage.child.forEach((a: Book) => {
            if (a.uniqueId === sectionId) {
                thisData = a;
            }
        });
    }

    const temp = { title, thisData, sectionId };
    if (context.viewState !== VIEW_TYPE.NONE) {
        return <FormView />;
    }

    return <Main {...temp} />
};

export default BodyRenderer;