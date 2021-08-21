import { activeChBg, activeScBg } from "./util";
import { useBookContext} from "../../service/BookServiceProvider";
import { VIEW_TYPE } from "../../globals/types";

const Sections = (props: any) => {
    const { sections, context, chapter, sectionId } = props;
    return <div> {sections.map((c: any) => {
        return (
            <div>
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        context.dispatch({
                            type: 'ID_SETTER',
                            payload: chapter.uniqueId,
                            idType: 'ACTIVE_ID',
                        });
                        context.dispatch({
                            type: 'ID_SETTER',
                            payload: c.uniqueId,
                            idType: 'SECTION_ID',
                        });
                    }}
                    key={c.uniqueId}
                    className={`section-nav hover ${activeScBg(
                        c,
                        sectionId
                    )}`}
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
    console.log(props);
    const { addNewSection } = props;
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
                    addNewSection: addNewSection,
                    context: context,
                    chapter: chapter, 
                    chapterIndex,
                    sectionIndex: null,
                    activeId: activeId,
                    sectionId: sectionId,
                    sections: sections,
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


const addNewSection = (
    // e: any,
    // props: BookNavigationProps,
    // sections: any,
    // c: any,
    // _index: number,
    // chapterId: string
    props: any
) => {
    const { sectionIndex, sections, context, chapter } = props;
    const { dispatch } = context;
    if (sectionIndex === null) {
        dispatch({
            type: 'ID_SETTER',
            payload: chapter.uniqueId,
            idType: 'PARENT_ID',
        });
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.SECTION,
        });
        return;
    }

    // if (_index === 0 && sections.length > 1) {
    //     const topUniqueId = chapterId;
    //     const nextSection = sections[_index + 1];
    //     const botUniqueId = nextSection.uniqueId;
    //     setParentId(chapterId);
    //     setCurrentFormType({
    //         formType: FormType.CREATE_UPDATE,
    //         formData: Some({
    //             topUniqueId,
    //             botUniqueId,
    //             identity: 105,
    //         }),
    //     });
    //     console.log(topUniqueId, botUniqueId);
    //     return;
    // }

    // const lengthMatchIndex = sections.length - 1;

    // if (sections.length > 1 && _index !== 0 && _index < lengthMatchIndex) {
    //     const currentSection = sections[_index];
    //     const nextSection = sections[_index + 1];
    //     const topUniqueId = currentSection.uniqueId;
    //     const botUniqueId = nextSection.uniqueId;
    //     setParentId(currentSection.uniqueId);
    //     setCurrentFormType({
    //         formType: FormType.CREATE_UPDATE,
    //         formData: Some({
    //             topUniqueId,
    //             botUniqueId,
    //             identity: 105,
    //         }),
    //     });
    //     return;
    // }

    // if (sections.length > 1 && _index === lengthMatchIndex) {
    //     const currentSection = sections[_index];
    //     setParentId(currentSection.uniqueId);
    //     setCurrentFormType({
    //         formType: FormType.SECTION,
    //         formData: None,
    //     });
    //     return;
    // }
};

const addNewChapter = (props: any) => {
    const { chapter, context } = props;
    const { dispatch } = context;
    // dispatch({
    //     type: 'ID_SETTER',
    //     payload: chapter.uniqueId,
    //     idType: 'PARENT_ID',
    // });
    dispatch({
        type: 'VIEW_SETTER',
        viewType: VIEW_TYPE.CHAPTER,
    });
};

const styles = {
    container: { width: "18%", marginTop: 24, paddingLeft: 8 },
    chapter: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}

export default ReadBookNavigation;
