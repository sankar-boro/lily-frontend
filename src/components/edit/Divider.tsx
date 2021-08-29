import { createSubSection } from "./util";
import { Book } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const Divider = (props: any) => {
    const { activePage, sectionId } = props;
    const context = useBookContext();
    return <div className="con-20" style={{backgroundColor: "#ffebf2"}}>
        <div className="li-item hover">Delete</div>
        <div className="li-item hover" onClick={(e) => createSubSection(context, sectionId, null, [])}>Add Sub-section</div>
        {activePage.child.map((x: Book, subSectionIndex: number) => {
            return <div>
                {x.title}
                <div onClick={(e) => createSubSection(context, sectionId, subSectionIndex, activePage)}>Add Sub-Section</div>
            </div>;
        })}
    </div>
}

export default Divider;
