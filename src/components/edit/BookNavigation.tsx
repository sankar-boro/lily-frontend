import { activeChBg, activeScBg, displayNone } from "./util";

const BookNavigation = (props: any) => {
    const {
        title,
        setActiveId,
        allPages,
        setSectionId,
        setParentId,
        setCurrentFormType,
        activeId,
        sectionId,
    } = props;

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
        <div>
            {allPages.map((value: any, index: number) => {
                const { chapter, sections } = doSome(value);
                console.log("chapter", chapter);
                console.log("sections", sections);
                return (
                    <div>
                        <div key={chapter.title}>
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveId(chapter.uniqueId);
                                    setCurrentFormType(null);
                                    setSectionId(null);
                                }}
                                className="chapter-nav"
                                style={activeChBg(chapter, activeId)}
                            >
                                {chapter.title}
                            </div>
                            <div style={displayNone(chapter, activeId)}>
                                {chapter.parentId ? (
                                    <div
                                        className="add-section"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentFormType(105);
                                            setParentId(chapter.uniqueId);
                                        }}
                                    >
                                        + section
                                    </div>
                                ) : null}
                                {sections.map((c: any) => {
                                    return (
                                        <div>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSectionId(c.uniqueId);
                                                    setParentId(c.uniqueId);
                                                }}
                                                key={c.uniqueId}
                                                style={{
                                                    ...activeScBg(c, sectionId),
                                                }}
                                                className="section-nav"
                                            >
                                                {c.title}
                                            </div>
                                            <div
                                                className="add-section"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentFormType(105);
                                                }}
                                            >
                                                + section
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentFormType(104);
                                setParentId(chapter.uniqueId);
                            }}
                            className="create-nav-button"
                        >
                            Add new Chapter
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export { BookNavigation };
