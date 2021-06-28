const BookNavigation = (props: any) => {
    const { title, setActiveId, allPages, setSectionId, setCurrentFormType } =
        props;

    const doSome = (data: any) => {
        let someData = data[1];
        let child = [];
        if (someData && someData.child && Array.isArray(someData.child)) {
            child = someData.child;
        }

        return {
            chapter: someData,
            sections: child,
        };
    };

    return (
        <div>
            {Object.entries(allPages).map((value: any, index: number) => {
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
                        >
                            {chapter.title}
                        </div>
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
                                    style={{ marginLeft: 15 }}
                                >
                                    {c.title}
                                </div>
                            );
                        })}
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
