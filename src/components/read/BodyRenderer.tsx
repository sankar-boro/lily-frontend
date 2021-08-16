import { Book } from "../../globals/types/book";
import { useBookContext} from "../../service/BookServiceProvider";


const BodyRenderer = (props: any) => {
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
    return (
        <div style={{width:"82%"}}>
            <div className="col-8">
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
            <div className="col-4">Divider</div>
        </div>
    );
};

export default BodyRenderer;