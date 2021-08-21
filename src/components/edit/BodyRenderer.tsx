import { useHistory } from "react-router-dom";
import Divider from "./Divider";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Book, VIEW_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const MainBody = (props: any) => {
    const context: any = useBookContext();
    const { thisData, sectionId } = props;

    if (context.viewState !== VIEW_TYPE.NONE) {
        return <FormView />;
    }

    return <div className="flex" style={{ backgroundColor: "#feffc4" }}>
        <div className="con-80 flex">
            <div className="con-10" style={{ backgroundColor: "#f5fff0"}} />
            <div className="con-80" >
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
            <div className="con-10" style={{ backgroundColor: "#e8feff" }} />
        </div>
        <Divider />
    </div>
}

const Main = (props: any) => {
    const { title } = props;
    return (
        <div className="con-80" style={{ backgroundColor: "#ceffc9" }}>
            <div className="flex" style={{ height: 35, alignItems: "center" }}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}></div>
            </div>
            <MainBody {...props} />
        </div>
    );
}

const FormView = () => {
    const context: any = useBookContext();

    if (context.viewState === VIEW_TYPE.CHAPTER) {
        return <AddChapter />;
    }
    if (context.viewState === VIEW_TYPE.SECTION) {
        return <AddSection />;
    }
    if (context.viewState === VIEW_TYPE.SUB_SECTION) {
        return <SubSection />;
    }
    if (context.viewState === VIEW_TYPE.CREATE_UPDATE) {
        return <CreateUpdate />;
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

    return <Main {...temp} />
};

export default BodyRenderer;