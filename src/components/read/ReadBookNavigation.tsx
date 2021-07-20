import { activeChBg, activeScBg } from "./util";

const ReadBookNavigation = (props: any) => {
    const { setActiveId, allPages, setSectionId, activeId, sectionId } = props;
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
        <div style={{ marginTop: 16 }}>
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
                            className={`chapter-nav hover ${activeChBg(
                                chapter,
                                activeId
                            )}`}
                        >
                            {chapter.title}
                        </div>
                        <div>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveId(chapter.uniqueId);
                                            setSectionId(c.uniqueId);
                                        }}
                                        key={c.uniqueId}
                                        className={`section-nav hover ${activeScBg(
                                            c,
                                            sectionId
                                        )}`}
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReadBookNavigation;
