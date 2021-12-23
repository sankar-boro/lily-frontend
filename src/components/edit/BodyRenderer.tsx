import { useHistory } from "react-router-dom";
import { MdHome, MdModeEdit, MdSearch, MdDelete } from 'react-icons/md';

import { deleteSubSection, deletePage } from "./crud/delete";
import Divider from "./Divider";
import Update from "../forms/Update";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Book, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";
import { constants } from "../../globals/constants";

const { _sbody } = constants.heights.fromTopNav;


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
    if (context.viewState === FORM_TYPE.UPDATE) {
        return <Update />;
    }
    return null;
};

const SubSections = (props: any) => {
    const { activePage, context } = props;
    const { hideSection, dispatch, bookId } = context;
    if (hideSection) return null;
    if (!activePage) return null;
    if (!activePage.child) return null;
    if (!Array.isArray(activePage.child)) return null;
    const subSections = activePage.child;

    return subSections.map((section: any, sectionIndex: number) => {
        return (
            <div key={section.uniqueId}>
                <div className="flex center">
                    <div className="con-95">
                        <h3 className="h3">{section.title}</h3>
                    </div>
                    <div className="con-5 hover">
                        <MdModeEdit onClick={() => {
                            const { child, ...others } = section;
                            dispatch({
                                type: 'FORM_PAGE_SETTER',
                                viewType: FORM_TYPE.UPDATE,
                                payload: others,
                            });
                        }}/>
                        <MdDelete onClick={() => deleteSubSection({
                            activePage,
                            sectionIndex,
                            section,
                            subSections,
                            bookId
                        })}/>
                    </div>
                </div>
                <div className="description">{section.body}</div>
            </div>
        );
    })
}

const Body = (props: any) => {
    const context: any = useBookContext();
    const { dispatch } = context;
    const { activePage } = props;

    if (context.viewState !== FORM_TYPE.NONE) {
        return (
            <div className="flex">
                <div className="con-80 flex">
                    <div className="con-10" />
                    <div className="con-80">
                        <FormView />
                    </div>
                    <div className="con-10" />
                </div>
                <Divider {...props} />
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80" style={{ paddingTop: 50 }}>
                    <div className="flex center">
                        <div className="con-95">
                            <h3 className="h3">{activePage.title}</h3>
                        </div>
                        <div className="con-5 hover">
                            <MdModeEdit onClick={() => {
                                const { child, ...others } = activePage;
                                dispatch({
                                    type: 'FORM_PAGE_SETTER',
                                    viewType: FORM_TYPE.UPDATE,
                                    payload: others,
                                });
                            }}/>
                            <MdDelete onClick={() => deletePage({
                                activePage,
                                context,
                            })}/>
                        </div>
                    </div>
                    <div className="description">{activePage.body}</div>
                    <SubSections {...props} />
                </div>
                <div className="con-10" />
            </div>
            <Divider {...props} />
        </div>
    );
}

const Main = (props: any) => {
    const { title, history } = props;
    return (
        <div className="con-80" style={{ marginLeft: "20%" }}>
            {/* Book title */}
            <div className="con-100 flex" style={{ height: _sbody, alignItems: "center" }}>
                <div className="con-80 flex">
                    <div className="flex con-10" style={{ alignItems: "center" }}>
                        <MdSearch className="hover" style={{ padding: 15 }}/>
                    </div>
                    <div className="con-80 flex center">
                        <h2 className="h2 book-title">{title}</h2>
                    </div>
                    <div className="con-10" />
                </div>
                <div className="con-20 flex">
                    <MdHome className="hover" onClick={() => { history.replace({ pathname: "/"})}}/>
                </div>
            </div>
            {/* Book title */}
            <Body {...props} />
        </div>
    );
}

const BodyRenderer = () => {
    const history: any = useHistory();
    const { title } = history.location.state;
    const context: any = useBookContext();
    const { activePage, sectionId } = context;

    const mainProps = { title, activePage, sectionId, context, history };

    if (!activePage) return null;
    
    return <Main {...mainProps} />
};

export default BodyRenderer;