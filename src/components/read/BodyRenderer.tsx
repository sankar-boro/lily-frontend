import { useHistory } from "react-router-dom";
import { MdHome } from 'react-icons/md';

import Divider from "./Divider";
import { Book } from "../../globals/types/book";
import { useBookContext } from "../../service/BookServiceProvider";
import { constants } from "../../globals/constants";

const { _sbody } = constants.heights.fromTopNav;

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
                <h4 className="h4" id={x.uniqueId}>{x.title}</h4>
                <div className="description">{x.body}</div>
            </div>
        );
    })
}

const Main = (props: any) => {
    const { title, activePage, history } = props;
    return (
        <div className="con-80" style={{ marginLeft: "20%" }}>
            <div className="con-100 flex" style={{ height: _sbody, alignItems: "center" }}>
                <div className="con-80 flex center">
                    <h2 className="h2 book-title">{title}</h2>
                </div>
                <div className="con-20 flex">
                    <MdHome className="hover" onClick={() => { history.replace({ pathname: "/"})}}/>
                </div>
            </div>
            <div className="con-100 flex">
                <div className="con-80 flex" style={{ paddingTop: 50 }}>
                    <div className="con-10" />
                    <div className="con-80">
                        <h3 className="h2" id={activePage.uniqueId}>{activePage.title}</h3>
                        <div className="description">{activePage.body}</div>
                        <SubSections {...props} />
                    </div>
                    <div className="con-10"/>
                </div>
                <Divider {...props} />
            </div>
        </div>
    );
}

const BodyRenderer = (props: any) => {
    const history: any = useHistory();
    const { title } = history.location.state;
    const context: any = useBookContext();
    const { activePage, sectionId } = context;
    const temp = {title, activePage, sectionId, context, history };

    if (activePage === null) return null;

    return <Main {...temp} />
};

export default BodyRenderer;