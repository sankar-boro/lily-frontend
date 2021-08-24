import { useHistory } from "react-router-dom";
import Divider from "./Divider";
import { editSubSection, createSubSection } from "./util";
import AddSubSection from "./AddSubSection";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Book, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const SectionBody = (section: any, subSectionIndex: number, props: any) => {
    const { uniqueId, title, body } = section;
    return <div key={uniqueId}>
        <div>
            <h4>{title}</h4>
            <div className="description">{body}</div>
        </div>
    </div>
}

const MainBody = (props: any) => {
    const context: any = useBookContext();
    const { thisData, sectionId } = props;
    const { editSubSectionId } = context;

    if (context.viewState !== FORM_TYPE.NONE) {
        return <FormView />;
    }

    return <div className="flex" style={{ backgroundColor: "#feffc4" }}>
        <div className="con-80 flex">
            <div className="con-10" style={{ backgroundColor: "#f5fff0"}} />
            <div className="con-80">
                <h3 className="h3" style={{marginBottom: 15 }}>{thisData.title}</h3>
                <div className="description">{thisData.body}</div>
                {sectionId &&
                    thisData.child &&
                    thisData.child.length > 0 &&
                    thisData.child.map((x: Book, subSectionIndex: number) => {
                        return SectionBody(x, subSectionIndex, props);
                    })}
            </div>
            <div className="con-10" style={{ backgroundColor: "#e8feff" }} />
        </div>
        <Divider payload={thisData} sectionId={sectionId} />
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

    if (context.viewState === FORM_TYPE.CHAPTER) {
        return <AddChapter />;
    }
    if (context.viewState === FORM_TYPE.SECTION) {
        return <AddSection />;
    }
    if (context.viewState === FORM_TYPE.SUB_SECTION) {
        return <SubSection />;
    }
    if (context.viewState === FORM_TYPE.CREATE_UPDATE) {
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

    const temp = { title, thisData, sectionId, context };

    return <Main {...temp} />
};

export default BodyRenderer;