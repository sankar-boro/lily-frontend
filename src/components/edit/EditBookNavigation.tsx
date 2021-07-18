import { activeScBg, Form } from "./util";
import { None, Some } from "ts-results";
import { Dispatch, SetStateAction } from "react";

type BookNavigationProps = {
    title: string;
    setActiveId: Dispatch<SetStateAction<string>>;
    allPages: any;
    setSectionId: Dispatch<SetStateAction<string | null>>;
    setParentId: Dispatch<SetStateAction<string | null>>;
    setCurrentFormType: Dispatch<SetStateAction<Form>>;
    activeId: string;
    sectionId: string | null;
};
const EditBookNavigation = (props: BookNavigationProps) => {
    const {
        setActiveId,
        allPages,
        setSectionId,
        setParentId,
        setCurrentFormType,
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
                    <div key={`${index}`}>
                        <div
                            className="chapter-nav"
                            // style={activeChBg(chapter, activeId)}
                        >
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
                                className="chapter-nav-title"
                            >
                                {chapter.title}
                            </div>
                            <div
                                onClick={(e) =>
                                    addNewChapter(e, props, index, chapter)
                                }
                            >
                                +
                            </div>
                        </div>
                        <div>
                            {sections.map((c: any, _index: number) => {
                                return (
                                    <div key={`${_index}`}>
                                        <div
                                            key={c.uniqueId}
                                            style={{
                                                marginLeft: 16,
                                                ...activeScBg(c, sectionId),
                                            }}
                                            className="section-nav"
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSectionId(c.uniqueId);
                                                    setActiveId(
                                                        chapter.uniqueId
                                                    );
                                                    setParentId(c.uniqueId);
                                                    setCurrentFormType({
                                                        formType: 404,
                                                        formData: None,
                                                    });
                                                }}
                                                className="section-nav-title"
                                            >
                                                {c.title}
                                            </div>
                                            <div
                                                onClick={(e: any) =>
                                                    addNewSection(
                                                        e,
                                                        props,
                                                        sections,
                                                        c,
                                                        _index
                                                    )
                                                }
                                            >
                                                +
                                            </div>
                                        </div>
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

const addNewChapter = (
    e: any,
    props: BookNavigationProps,
    index: number,
    chapter: any
) => {
    const { setCurrentFormType, setParentId, allPages } = props;
    e.preventDefault();
    let lastIndex = allPages.length - 1;
    if (index < lastIndex) {
        let nextPageUpdateInfo = allPages[index + 1];
        let parentPageInfo = allPages[index];
        let topUniqueId = parentPageInfo.uniqueId;
        let botUniqueId = nextPageUpdateInfo.uniqueId;
        setCurrentFormType({
            formType: 107,
            formData: Some({
                topUniqueId: topUniqueId,
                botUniqueId: botUniqueId,
                identity: 104,
            }),
        });
        setParentId(chapter.uniqueId);
    } else {
        setCurrentFormType({
            formType: 104,
            formData: None,
        });
        setParentId(chapter.uniqueId);
    }
};

const addNewSection = (
    e: any,
    props: BookNavigationProps,
    sections: any,
    c: any,
    _index: number
) => {
    const { setCurrentFormType, setParentId } = props;
    e.preventDefault();
    let lastIndex = sections.length - 1;
    if (_index < lastIndex) {
        let nextPageUpdateInfo = sections[_index + 1];
        let parentPageInfo = sections[_index];
        let topUniqueId = parentPageInfo.uniqueId;
        let botUniqueId = nextPageUpdateInfo.uniqueId;
        setCurrentFormType({
            formType: 107,
            formData: Some({
                topUniqueId,
                botUniqueId,
                identity: 106,
            }),
        });
    } else {
        setParentId(c.uniqueId);
        setCurrentFormType({
            formType: 105,
            formData: None,
        });
    }
};
export { EditBookNavigation };
