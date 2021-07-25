import { Some, Option, None } from "ts-results";

type Book = {
    bookId: string;
    authorId: string;
    authorName: string;
    title: string;
    body: string;
    parentId: string;
    uniqueId: string;
    createdAt: string;
    updatedAt: string;
    identity: number;
};

type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

enum FormType {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
}

type Form = {
    formType: FormType;
    formData: Option<FormData>;
};

const sortAll = (data: Book[], parentId: string) => {
    let lastParentId = parentId;
    let newData: any = [];
    data.forEach((b) => {
        if (b.identity === 101) {
            newData.push({ ...b });
        }
    });
    data.forEach((d) => {
        if (d.identity === 104) {
            newData.push({ ...d, child: [] });
        }
    });
    data.forEach((d) => {
        if (d.identity === 105) {
            newData.forEach((n: any) => {
                if (n.uniqueId === d.parentId) {
                    n.child.push({ ...d, child: [] });
                }
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                c["child"] = [];
                data.forEach((dd: any) => {
                    if (dd.parentId === c.uniqueId) {
                        c.child.push(dd);
                    }
                });
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                if (c.child) {
                    data.forEach((dd: any) => {
                        if (dd.identity === 106) {
                            c.child.forEach((a: any) => {
                                if (dd.parentId === a.uniqueId) {
                                    c.child.push(dd);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    return newData;
};

const activeChBg = (c: any, a: string | null) => {
    let color = "white";
    if (a && c.uniqueId === a) {
        color = "#eff0f1";
    }
    return {
        backgroundColor: color,
    };
};
const activeScBg = (c: any, a: string | null) => {
    if (a && c.uniqueId === a) {
        return {
            backgroundColor: "#f1f1f1",
        };
    }
    return {};
};
const displayNone = (c: any, a: string) => {
    let display = "none";
    if (c.uniqueId === a) {
        display = "block";
    }
    return {
        display,
    };
};

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

const getChapterData = (
    value: any,
    index: number,
    totalChapters: number,
    allPages: any,
    props: any
) => {
    const { chapter, sections } = doSome(value);
    const { setCurrentFormType, setParentId } = props;
    let formData = {
        formType: FormType.NONE,
        chapter,
        updateIds: {
            topUniqueId: "",
            botUniqueId: "",
        },
        identity: 104,
        parentId: chapter.uniqueId,
        setCurrentFormType,
        setParentId,
    };
    const currentPageNo = index + 1;
    // let hideForm = false;
    const formHelp = () => {
        if (totalChapters === 1) {
            formData.formType = FormType.CHAPTER;
            // hideForm = true;
            return;
        }

        if (totalChapters > 1 && currentPageNo < totalChapters) {
            formData.formType = FormType.CREATE_UPDATE;
            formData.updateIds.topUniqueId = chapter.uniqueId;
            formData.updateIds.botUniqueId = allPages[index + 1].uniqueId;
            return;
        }

        if (currentPageNo === totalChapters) {
            formData.formType = FormType.CHAPTER;
        }
    };

    formHelp();

    console.log("formData", formData);

    return {
        chapterData: doSome(value),
        formData,
        key: index,
    };
};

// const getSectionData = (
//     e: any,
//     props: any,
//     sections: any,
//     data: any,
//     index: number
// ) => {
//     e.preventDefault();
//     let formData = {
//         formType: 105,
//         chapter,
//         updateIds: {
//             topUniqueId: "",
//             botUniqueId: "",
//         },
//         identity: 105,
//         parentId: chapter.uniqueId,
//         setCurrentFormType,
//         setParentId,
//     };
// };

export {
    sortAll,
    activeChBg,
    activeScBg,
    displayNone,
    getChapterData,
    FormType,
    // getSectionData,
};
export type { Book, Form, FormData, FormType as FormTypes };
