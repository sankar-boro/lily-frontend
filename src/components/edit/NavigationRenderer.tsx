import { addNewChapter, addNewSection, sectionOnClick } from "./util";
import { useBookContext} from "../../service/BookServiceProvider";

const Sections = (props: any) => {
    const { page } = props;
    let pageSections = [];

    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        pageSections = page.child;
    }

    if (pageSections.length === 0) return null;
    return <div> {pageSections.map((section: any, sectionIndex: number) => {
        return (
            <div>
                <div
                    onClick={(e) => sectionOnClick(e, props, section)}
                    key={section.uniqueId}
                    className="section-nav"
                >
                    {section.title}
                </div>
                <AddSection {...props} sectionIndex={sectionIndex} />
            </div>
        );
    })} 
    </div>
}

const PageTitle = (props: any) => {
    const { page } = props;
    const context = useBookContext();
    const { dispatch } = context;
    
    const setActivePage = (e: any) => {
        e.preventDefault();
        dispatch({
            type: 'ID_SETTER',
            payload: page.uniqueId,
            idType: 'ACTIVE',
        });
        dispatch({
            type: 'ID_SETTER',
            payload: null,
            idType: 'SECTION',
        });
        dispatch({
            type: 'FORM_VIEW_SETTER',
            viewType: 'NONE'
        });
    };

    return <div
        onClick={setActivePage}
        className="chapter-nav hover"
    >
        {page.title}
    </div>
}

const AddSection = (props: any) => {
    const context = useBookContext();
    return <div 
        className="hover" 
        style={{marginTop:5}}
        onClick={(e: any) => {
            e.preventDefault();
            addNewSection(props, context);
        }}
    >
        <span style={{ marginLeft: 20, fontSize: 12 }}>+ Add section</span>
    </div>
}

const AddChapter = (props: any) => {
    const context = useBookContext();
    return (
        <div
            style={{marginTop:5}}
            className="hover"
            onClick={(e: any) => {
                e.preventDefault();
                addNewChapter(props, context);
            }}
        >
            <span style={{ fontSize: 12 }}>+ Add chapter</span>
        </div>
    );
}

const NavigationPages = (props: any) => {
    const { page } = props;
    return (
        <div style={styles.chapter} key={page.uniqueId}>
            <PageTitle {...props} />
            <AddSection {...props} />
            <Sections {...props} />
            <AddChapter {...props} />
        </div>
    )
}

const Main = () => {
    const context = useBookContext();
    const { data: bookPages } = context.service;
    return (
        <div className="con-20" style={{ padding: "0px 10px" }}>
            <div style={{ height: 35 }}/>
            {bookPages.map((page: any, pageIndex: number) => <NavigationPages page={page} pageIndex={pageIndex} />)}
        </div>
    );
};

export default Main;

const styles = {
    container: { width: "18%", marginTop: 24, paddingLeft: 8 },
    chapter: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}
