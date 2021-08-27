import { useHistory } from "react-router-dom";
import Divider from "./Divider";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Book, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const SubSectionBody = (section: any, subSectionIndex: number, props: any) => {
    const { uniqueId, title, body } = section;
    return <div key={uniqueId}>
        <div>
            <h3 className="h3">{title}</h3>
            <div className="description">{body}</div>
        </div>
    </div>
}

const Body = (props: any) => {
    const context: any = useBookContext();
    const { activePageOrSection, sectionId } = props;

    if (context.viewState !== FORM_TYPE.NONE) {
        return <FormView />;
    }

    let subSections = [];
    if (sectionId && activePageOrSection.child &&
        activePageOrSection.child.length > 0
    ) {
        subSections = activePageOrSection.child;
    }

    return <div className="flex" style={{ backgroundColor: "#feffc4" }}>
        <div className="con-80 flex">
            <div className="con-10" style={{ backgroundColor: "#f5fff0"}} />
            <div className="con-80">
                <h3 className="h3">{activePageOrSection.title}</h3>
                <div className="description">{activePageOrSection.body}</div>
                {subSections.map((x: Book, subSectionIndex: number) => {
                    return SubSectionBody(x, subSectionIndex, props);
                })}
            </div>
            <div className="con-10" style={{ backgroundColor: "#e8feff" }} />
        </div>
        <Divider subSections={subSections} sectionId={sectionId} />
    </div>
}

const Main = (props: any) => {
    const { title } = props;
    return (
        <div className="con-80" style={{ backgroundColor: "#ceffc9" }}>
            {/* Book title */}
            <div className="flex" style={{ height: 35, alignItems: "center" }}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}></div>
            </div>
            {/* Book title */}
            <Body {...props} />
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
    let activePageOrSection = activePage;
    if (sectionId && activePageOrSection.child && activePageOrSection.child.length > 0) {
        activePageOrSection.child.forEach((a: Book) => {
            if (a.uniqueId === sectionId) {
                activePageOrSection = a;
            }
        });
    }

    const mainProps = { title, activePageOrSection, sectionId, context };

    return <Main {...mainProps} />
};

export default BodyRenderer;