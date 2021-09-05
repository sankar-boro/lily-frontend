import { createSubSection } from "./util";
import { Book } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const AddSubSection = (props: any) => {
    const { activePage } = props;
    const { identity } = activePage;

    if (identity < 105) return null;

    return <div className="li-item hover" onClick={(e) => createSubSection(props)}>Add Sub-section</div>
}

const Divider = (props: any) => {
    const { activePage } = props;
    const { identity } = activePage;
    const context = useBookContext();

    return <div className="con-20" style={{backgroundColor: "#ffebf2"}}>
        <div className="li-item hover">Delete</div>
        <AddSubSection {...props} context={context} subSectionIndex={null} />
        {identity === 105 && activePage.child.map((subSection: any, subSectionIndex: number) => {
            return <div key={subSection.uniqueId}>
                {subSection.title}
                <AddSubSection {...props} context={context} subSection={subSection} subSectionIndex={subSectionIndex} />
            </div>;
        })}
    </div>
}

export default Divider;
