import { useHistory } from "react-router";
import { Book } from "../../globals/types/index";

const Divider = (props: any) => {
    const { activePage, sectionId, context, subSectionIndex } = props;
    const { identity } = activePage;
    const history: any = useHistory();
    const { bookId } = context;
    const editNavigate = (e: any) => {
        e.preventDefault();
        history.push({
            pathname: `/book/edit/${bookId}`,
            state: history.location.state,
        });
    }
    return <div className="con-20">
        <div className="li-item hover" onClick={editNavigate}>Edit</div>
        <div className="li-item hover">Delete</div>
        <div>
            {identity === 105 && activePage.child.map((x: Book, subSectionIndex: number) => {
                return <div className="li-item hover">
                    <a href={`#${x.uniqueId}`}>    
                        {x.title}
                    </a>
                </div>;
            })}
        </div>
    </div>
}

export default Divider;
