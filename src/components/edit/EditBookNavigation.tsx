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
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 8,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(chapter.uniqueId);
                                setCurrentFormType({
                                    formType: 404,
                                    formData: None,
                                });
                                setSectionId(null);
                            }}
                        >
                            {chapter.title}
                        </div>
                        {/* section */}
                        <div
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 16,
                            }}
                            onClick={(e: any) =>
                                addNewSection(e, props, sections, chapter, 0)
                            }
                        >
                            <span
                                style={{
                                    borderLeft: "1px solid #ccc",
                                    marginRight: 8,
                                }}
                            />
                            +
                        </div>
                        <div
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 16,
                            }}
                        >
                            {sections.map((c: any, _index: number) => {
                                return (
                                    <div>
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSectionId(c.uniqueId);
                                                setActiveId(chapter.uniqueId);
                                                setParentId(c.uniqueId);
                                                setCurrentFormType({
                                                    formType: 404,
                                                    formData: None,
                                                });
                                            }}
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
                                            <span
                                                style={{
                                                    borderLeft:
                                                        "1px solid #ccc",
                                                    marginRight: 8,
                                                }}
                                            />
                                            +
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* chapter */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
                            className="hover"
                            onClick={(e) =>
                                addNewChapter(e, props, index, chapter)
                            }
                        >
                            +
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
        console.log("chapter");
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
