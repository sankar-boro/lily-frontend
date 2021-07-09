import { activeChBg, activeScBg, displayNone } from "./util";

const BookNavigation = (props: any) => {
    const {
        title,
        setActiveId,
        allPages,
        setSectionId,
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
                return (
                    <div key={chapter.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(chapter.uniqueId);
                                setSectionId(null);
                            }}
                            className="chapter-nav"
                            style={activeChBg(chapter, activeId)}
                        >
                            {chapter.title}
                        </div>
                        <div style={displayNone(chapter, activeId)}>
                            <div
                                className="add-section"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentFormType(105);
                                }}
                            >
                                Add section
                            </div>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSectionId(c.uniqueId);
                                        }}
                                        key={c.uniqueId}
                                        style={{
                                            marginLeft: 15,
                                            ...activeScBg(c, sectionId),
                                        }}
                                        className="section-nav"
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <hr />
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(103);
                }}
                className="create-nav-button"
            >
                Add new Page
            </div>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentFormType(104);
                }}
                className="create-nav-button"
            >
                Add new Chapter
            </div>
        </div>
    );
};

export { BookNavigation };
