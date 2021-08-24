import { useHistory } from "react-router";
import { createSubSection } from "./util";
import { Book, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";

const Divider = (props: any) => {
    const { payload, sectionId } = props;
    const history: any = useHistory();
    const context = useBookContext();
    const { bookId } = context;
    const editNavigate = (e: any) => {
        e.preventDefault();
        history.push({
            pathname: `/book/edit/${bookId}`,
            state: history.location.state,
        });
    }
    console.log('props', props);
    return <div className="con-20" style={{backgroundColor: "#ffebf2"}}>
        <div className="li-item hover">Delete</div>
        <div className="li-item hover" onClick={() => createSubSection(context, sectionId)}>Add Sub-section</div>
        {payload && payload.child && payload.child.map((x: Book, subSectionIndex: number) => {
            return <div>{x.title}</div>;
        })}
    </div>
}

export default Divider;
