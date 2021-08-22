import { VIEW_TYPE } from "../../globals/types";
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
    context: any
) => {
    const { sectionIndex, sections, chapter } = props;
    const { dispatch } = context;
    if (sectionIndex === null && sections.length === 0) {
        dispatch({
            type: 'ID_SETTER',
            payload: chapter.uniqueId,
            idType: 'FORM_ID',
        });
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.SECTION,
        });
        return;
    }

    if (sectionIndex === null && sections.length > 0) {
        const topUniqueId = chapter.uniqueId;
        const botUniqueId = sections[0].uniqueId;
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.SECTION,
        });
        dispatch({
            type: 'ID_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 107,
            },
            idType: 'FORM_ID',
        });
        return;
    }

    const lastSectionIndex = sections.length - 1;

    if (sectionIndex === lastSectionIndex) {
        const uniqueId = sections[sectionIndex].uniqueId;
        dispatch({
            type: 'ID_SETTER',
            payload: uniqueId,
            idType: 'FORM_ID',
        });
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.SECTION,
        });
        return;
    }

    if (sectionIndex !== lastSectionIndex) {
        const topUniqueId = sections[sectionIndex].uniqueId;
        const botUniqueId = sections[sectionIndex + 1].uniqueId;
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.SECTION,
        });
        dispatch({
            type: 'ID_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 107,
            },
            idType: 'FORM_ID',
        });
    }
};

const addNewChapter = (props: any, context: any) => {
    const { chapter, data, chapterIndex } = props;
    console.log('data', data);
    const { dispatch } = context;
    const lastPageIndex = data.length - 1;
    
    if (chapterIndex === lastPageIndex) {
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.CHAPTER,
        });
        dispatch({
            type: 'ID_SETTER',
            payload: {
                parentId: chapter.uniqueId,
                identity: 104,
            },
            idType: 'FORM_ID',
        });
    } else {
        const topUniqueId = data[chapterIndex].uniqueId;
        const botUniqueId = data[chapterIndex + 1].uniqueId;
        dispatch({
            type: 'VIEW_SETTER',
            viewType: VIEW_TYPE.CREATE_UPDATE,
        });
        dispatch({
            type: 'ID_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 104,
            },
            idType: 'FORM_ID',
        });
    }
};

const sectionOnClick = (e: any, props: any) => {
    e.preventDefault();
    const { context, chapter, section } = props;
    context.dispatch({
        type: 'ID_SETTER',
        payload: chapter.uniqueId,
        idType: 'ACTIVE_ID',
    });
    context.dispatch({
        type: 'ID_SETTER',
        payload: section.uniqueId,
        idType: 'SECTION_ID',
    });
}

export { sortAll, activeChBg, activeScBg, displayNone, getPages, addNewChapter, addNewSection, sectionOnClick };
export type { Book };
