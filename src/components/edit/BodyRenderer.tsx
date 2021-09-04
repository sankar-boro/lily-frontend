import { useHistory } from "react-router-dom";
import { MdHome } from 'react-icons/md';

import Divider from "./Divider";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Book, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

// const SubSectionBody = (section: any, subSectionIndex: number, props: any) => {
//     const { uniqueId, title, body } = section;
//     return <div key={uniqueId}>
//         <div>
//             <h3 className="h3">{title}</h3>
//             <div className="description">{body}</div>
//         </div>
//     </div>
// }

const SubSections = (props: any) => {
    const { activePage, context } = props;
    const { hideSection } = context;
    if (hideSection) return null;
    if (!activePage) return null;
    if (!activePage.child) return null;
    if (!Array.isArray(activePage.child)) return null;
    const sections = activePage.child;

    return sections.map((x: Book) => {
        return (
            <div key={x.uniqueId}>
                <h4 className="h4">{x.title}</h4>
                <div className="description">{x.body}</div>
            </div>
        );
    })
}

const Body = (props: any) => {
    const context: any = useBookContext();
    const { activePage } = props;

    if (context.viewState !== FORM_TYPE.NONE) {
        return <FormView />;
    }

    return <div className="flex" style={{ backgroundColor: "#feffc4" }}>
        <div className="con-80 flex">
            <div className="con-10" style={{ backgroundColor: "#f5fff0"}} />
            <div className="con-80">
                <h3 className="h3">{activePage.title}</h3>
                <div className="description">{activePage.body}</div>
                <SubSections {...props} />
            </div>
            <div className="con-10" style={{ backgroundColor: "#e8feff" }} />
        </div>
        <Divider activePage={activePage} />
    </div>
}

const Main = (props: any) => {
    const { title, history } = props;
    return (
        <div className="con-80" style={{ backgroundColor: "#ffedbd" }}>
            {/* Book title */}
            <div className="flex" style={{ height: 35, alignItems: "center", backgroundColor: "#ffbdff" }}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}>
                    <MdHome className="hover" onClick={() => { history.replace({ pathname: "/"})}}/>
                </div>
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

    const mainProps = { title, activePage, sectionId, context, history };

    if (!activePage) return null;
    
    return <Main {...mainProps} />
};

export default BodyRenderer;