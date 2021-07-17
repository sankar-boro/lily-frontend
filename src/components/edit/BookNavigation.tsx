import { activeChBg, activeScBg, displayNone, Form } from "./util";
import { None, Some } from "ts-results";
import { Dispatch, SetStateAction } from "react";

type SetCurrentFormType = (a: Form) => void;

const BookNavigation = (props: {
    title: string;
    setActiveId: Dispatch<SetStateAction<string>>;
    allPages: any;
    setSectionId: Dispatch<SetStateAction<string | null>>;
    setParentId: Dispatch<SetStateAction<string | null>>;
    setCurrentFormType: Dispatch<SetStateAction<Form>>;
    activeId: string;
    // bookId: string | null;
    sectionId: string | null;
}) => {
    const {
        title,
        setActiveId,
        allPages,
        setSectionId,
        setParentId,
        setCurrentFormType,
        activeId,
        sectionId,
        // bookId,
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
                    <div key={`${index}`}>
                        <div key={chapter.title}>
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveId(chapter.uniqueId);
                                    setCurrentFormType({
                                        formType: 404,
                                        formData: None,
                                    });
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
                                            setCurrentFormType({
                                                formType: 105,
                                                formData: None,
                                            });
                                            setParentId(chapter.uniqueId);
                                        }}
                                    >
                                        + section
                                    </div>
                                ) : null}
                                {sections.map((c: any, _index: number) => {
                                    return (
                                        <div key={`${_index}`}>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSectionId(c.uniqueId);
                                                    setParentId(c.uniqueId);
                                                    setCurrentFormType({
                                                        formType: 404,
                                                        formData: None,
                                                    });
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
                                                    setCurrentFormType({
                                                        formType: 105,
                                                        formData: None,
                                                    });

                                                    let lastIndex =
                                                        allPages.length - 1;
                                                    if (index < lastIndex) {
                                                        let nextPageUpdateInfo =
                                                            allPages[index + 1];
                                                        let parentPageInfo =
                                                            allPages[index];
                                                        let topUniqueId =
                                                            parentPageInfo.uniqueId;
                                                        let botUniqueId =
                                                            nextPageUpdateInfo.uniqueId;
                                                        setCurrentFormType({
                                                            formType: 105,
                                                            formData: Some({
                                                                topUniqueId,
                                                                botUniqueId,
                                                            }),
                                                        });
                                                    }
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
                                let lastIndex = allPages.length - 1;
                                if (index < lastIndex) {
                                    let nextPageUpdateInfo =
                                        allPages[index + 1];
                                    let parentPageInfo = allPages[index];
                                    let topUniqueId = parentPageInfo.uniqueId;
                                    let botUniqueId =
                                        nextPageUpdateInfo.uniqueId;
                                    setCurrentFormType({
                                        formType: 104,
                                        formData: Some({
                                            topUniqueId: topUniqueId,
                                            botUniqueId: botUniqueId,
                                        }),
                                    });
                                    setParentId(chapter.uniqueId);
                                }
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
