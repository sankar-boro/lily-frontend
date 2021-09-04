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
                <h4 className="h4">{x.title}</h4>
                <div className="description">{x.body}</div>
            </div>
        );
    })
}

const Main = (props: any) => {
    const { title, activePage, history } = props;
    return (
        <div className="con-80">
            <div className="con-100 flex" style={{ height: _sbody, alignItems: "center", backgroundColor: "#ffedbd" }}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}>

                    <MdHome className="hover" onClick={() => { history.replace({ pathname: "/"})}}/>
                </div>
            </div>
            <div className="con-100 flex">
                <div className="con-80 flex">
                    <div className="con-10" style={{backgroundColor: "#e8feff" }}/>
                    <div className="con-80" style={{ backgroundColor: "#e8e8ff" }}>
                        <h3 className="h3">{activePage.title}</h3>
                        <div className="description">{activePage.body}</div>
                        <SubSections {...props} />
                    </div>
                    <div className="con-10" style={{ backgroundColor: "#fffee0" }}/>
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