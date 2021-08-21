import { activeChBg, addNewChapter, addNewSection, sectionOnClick } from "./util";
import { useBookContext} from "../../service/BookServiceProvider";

const Sections = (props: any) => {
    const { sections } = props;
    return <div> {sections.map((c: any) => {
        return (
            <div>
                <div
                    onClick={(e) => sectionOnClick(e, props)}
                    key={c.uniqueId}
                    className="section-nav"
                >
                    {c.title}
                </div>
                <AddSection {...props} />
            </div>
        );
    })} 
    </div>
}

const PageTitle = (props: any) => {
    const { context, chapter, activeId } = props;
    const { dispatch } = context;
    return <div
        onClick={(e) => {
            e.preventDefault();
            dispatch({
                type: 'ID_SETTER',
                payload: chapter.uniqueId,
                idType: 'ACTIVE_ID',
            });
            dispatch({
                type: 'ID_SETTER',
                payload: null,
                idType: 'SECTION_ID',
            });
            dispatch({
                type: 'VIEW_SETTER',
                viewType: 'NONE'
            });
        }}
        className={`chapter-nav hover ${activeChBg(
            chapter,
            activeId
        )}`}
    >
        {chapter.title}
    </div>
}

const AddSection = (props: any) => {
    return <div 
        className="hover" 
        style={{marginTop:5}}
        onClick={(e: any) => {
            e.preventDefault();
            addNewSection(props);
        }}
    >
        <span style={{ marginLeft: 20, fontSize: 12 }}>+ Add section</span>
    </div>
}

const AddChapter = (props: any) => {
    return <div
            style={{marginTop:5}}
            className="hover"
            onClick={(e: any) => {
                e.preventDefault();
                addNewChapter(props);
            }}
        >
            <span style={{ fontSize: 12 }}>+ Add chapter</span>
        </div>
}

const ReadBookNavigation = () => {
    const context = useBookContext();
    const { data, activeId, sectionId } = context;
    const doSome = (data: any) => {
        let child = [];
        if (data && data.child && Array.isArray(data.child)) {
            child = data.child;
        }

        return {
            chapter: data,
            sections: child,
        };
    };
    return (
        <div className="con-20" style={{ backgroundColor: "#c0d6fa", padding: "0px 10px" }}>
            <div style={{ height: 35 }}/>
            {data.map((value: any, chapterIndex: number) => {
                const { chapter, sections } = doSome(value);
                let props = {
                    context: context,
                    chapter: chapter, 
                    chapterIndex,
                    sectionIndex: null,
                    activeId: activeId,
                    sectionId: sectionId,
                    sections: sections,
                    data: data,
                }
                return (
                    <div style={styles.chapter} key={chapter.title}>
                        <PageTitle {...props} />
                        <AddSection {...props} />
                        <Sections {...props} />
                        <AddChapter {...props} />
                    </div>
                );
            })}
        </div>
    );
};

const styles = {
    container: { width: "18%", marginTop: 24, paddingLeft: 8 },
    chapter: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}

export default ReadBookNavigation;
