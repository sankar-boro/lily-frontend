import { useHistory } from "react-router-dom";
import Divider from "./Divider";
import { Book } from "../../globals/types/book";
import { useBookContext } from "../../service/BookServiceProvider";

const Main = (props: any) => {
    const { title, thisData, sectionId } = props;
    return (
        <div className="con-80">
            <div className="con-100 flex" style={{ height: 35, alignItems: "center", backgroundColor: "#e8eaff" }}>
                <div style={{ width:"20%" }}></div>
                <div style={{ width:"60%" }}><h2 className="h2">{title}</h2></div>
                <div style={{ width:"20%" }}></div>
            </div>
            <div className="con-100 flex">
                <div className="con-80 flex">
                    <div className="con-10" style={{backgroundColor: "#e8feff" }}/>
                    <div className="con-80" style={{ backgroundColor: "#e8e8ff" }}>
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
                    <div className="con-10" style={{ backgroundColor: "#fffee0" }}/>
                </div>
                <Divider />
            </div>
        </div>
    );
}

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

    const temp = {title, thisData, sectionId};
    return <Main {...temp} />
};

export default BodyRenderer;