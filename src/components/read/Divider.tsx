import { useHistory } from "react-router";
import { useBookContext } from "../../service/BookServiceProvider";

const Divider = () => {
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
    return <div>
        <div className="li-item hover" onClick={editNavigate}>Edit</div>
        <div className="li-item hover">Delete</div>
    </div>
}

export default Divider;
