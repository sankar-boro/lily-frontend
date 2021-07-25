import { activeScBg, getChapterData, Form, FormType } from "./util";
import { None, Some } from "ts-results";
import { Dispatch, SetStateAction } from "react";
import { FormatLineSpacingOutlined } from "@material-ui/icons";

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

type ChapterFormData = {
    formType: FormType;
    chapter: any;
    updateIds: {
        topUniqueId: string;
        botUniqueId: string;
    };
    identity: number;
    parentId: string;
    setCurrentFormType: Dispatch<SetStateAction<Form>>;
    setParentId: Dispatch<SetStateAction<string | null>>;
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

    let totalChapters = allPages.length;
    return (
        <div>
            {allPages.map((value: any, index: number) => {
                const { chapterData, formData, key } = getChapterData(
                    value,
                    index,
                    totalChapters,
                    allPages,
                    props
                );
                const { sections, chapter } = chapterData;
                return (
                    <div key={key}>
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
                                    formType: FormType.NONE,
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
                                    <div key={`${_index}`}>
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSectionId(c.uniqueId);
                                                setActiveId(chapter.uniqueId);
                                                setParentId(c.uniqueId);
                                                setCurrentFormType({
                                                    formType: FormType.NONE,
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
                            onClick={(e) => addNewChapter(e, formData)}
                        >
                            +
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const addNewChapter = (e: any, formData: ChapterFormData) => {
    e.preventDefault();
    const { updateIds, chapter, setCurrentFormType, setParentId } = formData;
    if (formData.formType === FormType.CREATE_UPDATE) {
        setCurrentFormType({
            formType: FormType.CREATE_UPDATE,
            formData: Some({
                topUniqueId: updateIds.topUniqueId,
                botUniqueId: updateIds.botUniqueId,
                identity: formData.identity,
            }),
        });
        setParentId(chapter.uniqueId);
    } else {
        setCurrentFormType({
            formType: FormType.CHAPTER,
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
            formType: FormType.CREATE_UPDATE,
            formData: Some({
                topUniqueId,
                botUniqueId,
                identity: 106,
            }),
        });
    } else {
        setParentId(c.uniqueId);
        setCurrentFormType({
            formType: FormType.SECTION,
            formData: None,
        });
    }
};
export { EditBookNavigation };
