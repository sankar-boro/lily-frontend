import { FORM_TYPE } from "../../globals/types";
import axios, { AxiosError, AxiosResponse } from "axios";

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

const getPages = (setAllPages: Function, bookId: string) => {
    axios
    .get(`http://localhost:8000/book/getall/${bookId}`, {
        withCredentials: true,
    })
    .then((res: AxiosResponse<any>) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            let dataRes: Book[] = res.data;
            let x = sortAll(dataRes);
            setAllPages(x);
        }
    })
    .catch((err: AxiosError<any>) => {
        // console.log("deleteerror", err.response);
    });
}

function groupSections(dd: any, s: any) {
    let pId = dd.uniqueId;
    let sections: any[] = [];
    let c = 0;

    let removeIds: any[] = [];
    let newIds: any[] = [];

    while (c !== s.length) {
        // eslint-disable-next-line no-loop-func
        s.forEach((ss: any) => {
            if (ss.parentId === pId) {
                sections.push(ss);
                pId = ss.uniqueId;
                removeIds.push(ss.uniqueId);
            }
        });
        c++;
    }

    s.forEach((ss: any) => {
        if (!removeIds.includes(ss.uniqueId)) {
            newIds.push(ss);
        }
    });

    return { data: { ...dd, child: sections }, newSections: newIds };
}

function buildSectionsReturnSections(
    chapters: any,
    sections: any,
    sub_sections: any
) {
    let dynaSections = sections;
    return chapters.map((chapter: any) => {
        let buildSections = groupSections(chapter, dynaSections);
        dynaSections = buildSections.newSections;

        if (
            buildSections.data.child &&
            Array.isArray(buildSections.data.child) &&
            buildSections.data.child.length === 0
        ) {
            return buildSections.data;
        }

        if (
            buildSections.data.child &&
            Array.isArray(buildSections.data.child) &&
            buildSections.data.child.length > 0
        ) {
            let dynaSubSections = sub_sections;
            let buildSubSections = buildSections.data.child.map(
                (sections_: any) => {
                    let tempBuildSubSections = groupSections(
                        sections_,
                        dynaSubSections
                    );
                    dynaSubSections = tempBuildSubSections.newSections;
                    return tempBuildSubSections.data;
                }
            );

            buildSections.data.child = buildSubSections;
            return buildSections.data;
        }
        return buildSections.data;
    });
}

function groups(book_data: Book[]) {
    let gs: any = {
        101: [],
        102: [],
        103: [],
        104: [],
        105: [],
        106: [],
    };

    book_data.forEach((d: Book) => {
        if (gs[d.identity]) {
            gs[d.identity].push(d);
        }
    });
    return gs;
}

const sortAll = (data: Book[]) => {
    let gs = groups(data);
    let ozf = gs[105];
    let ozs = gs[106];

    let c = { 101: gs[101], 102: gs[102], 103: gs[103], 104: gs[104] };
    let chapters: Book[] = [];
    Object.values(c).forEach((v) => {
        let a = buildSectionsReturnSections(v, ozf, ozs);
        chapters = [...chapters, ...a];
    });
    return chapters;
};

const activeChBg = (c: any, a: string) => {
    if (c.uniqueId === a) {
        return "active-nav";
    }
    return "no-active-nav";
};
const activeScBg = (c: any, a: string) => {
    if (c.uniqueId === a) {
        return "active-nav";
    }
    return "no-active-nav";
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

const addNewSection = (
    props: any,
) => {
    const { sectionIndex, page, context } = props;
    let sections = page.child;
    const { dispatch } = context;
    if (!sectionIndex && sections.length === 0) {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.SECTION,
            payload: {
                parentId: page.uniqueId,
                identity: 105
            },
        });
        return;
    }

    if (!sectionIndex && sections.length > 0) {
        const topUniqueId = page.uniqueId;
        const botUniqueId = sections[0].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 105,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

    const lastSectionIndex = sections.length - 1;

    if (sectionIndex === lastSectionIndex) {
        const uniqueId = sections[sectionIndex].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                parentId: uniqueId,
                identity: 105,
            },
            viewType: FORM_TYPE.SECTION,
        });
        return;
    }

    if (sectionIndex !== lastSectionIndex) {
        const topUniqueId = sections[sectionIndex].uniqueId;
        const botUniqueId = sections[sectionIndex + 1].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 105,
            },
            viewType: FORM_TYPE.SECTION,
        });
    }
};

const addNewChapter = (props: any) => {
    const { page, pageIndex, context } = props;
    const { apiData, dispatch } = context;
    const lastPageIndex = apiData.length - 1;
    
    if (pageIndex === lastPageIndex) {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.CHAPTER,
            payload: {
                parentId: page.uniqueId,
                identity: 104,
            }
        });
    } else {
        if (!apiData && !apiData[pageIndex]) return;
        const topUniqueId = apiData[pageIndex].uniqueId;
        const botUniqueId = apiData[pageIndex + 1].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.CREATE_UPDATE,
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 104,
            }
        });
    }
};

const createSubSection = (props: any) => {
    const { context, subSectionIndex, activePage } = props;
    const { viewData } = context;
    const subSections = activePage.child;
    const { dispatch } = context;
    const sectionId = viewData.uniqueId;

    if (!subSectionIndex && subSections.length === 0) {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.SUB_SECTION,
            payload: {
                parentId: sectionId,
                identity: 106,
            }
        });
        return;
    }


    if (!subSectionIndex && subSections.length > 0) {
        let topUniqueId = sectionId;
        let botUniqueId = subSections[0].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 106,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

    const subSectionsLength = subSections.length - 1;

    if (subSectionIndex && subSectionIndex < subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        let botUniqueId = subSections[subSectionIndex+1].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 106,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

    if (subSectionIndex && subSectionIndex === subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.SUB_SECTION,
            payload: {
                parentId: topUniqueId,
                identity: 106,
            },
        });
    }
}

const isLastElement = (_array: any, index: number) => {
    const l = _array.length - 1;
    if (index === l) return true;
    return false;
} 

const deleteSection = (props: any) => {
    const { activePage, sectionIndex, section, sections, bookId } = props;
    let _isLast = false;
    if (sectionIndex && sections && Array.isArray(sections)) {
        _isLast = isLastElement(sections, sectionIndex);
    }

    if (_isLast) {
        let _deleteData = {
            bookId: null,
            deleteId: null,
        };
        _deleteData.bookId = bookId;
        _deleteData.deleteId = section.uniqueId;
        return;
    }
}

const deletePage = (props: any) => {
}

export { 
    sortAll, 
    activeChBg, 
    activeScBg, 
    displayNone, 
    getPages, 
    addNewChapter, 
    addNewSection, 
    createSubSection,
    deleteSection,
    deletePage,
};

export type { Book };
