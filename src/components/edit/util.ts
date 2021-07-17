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

type Form = {
    formType: number;
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
        color = "#ccc";
    }
    return {
        backgroundColor: color,
    };
};
const activeScBg = (c: any, a: string | null) => {
    if (a && c.uniqueId === a) {
        return {
            borderLeft: `5px solid black`,
            paddingLeft: "5px",
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

export { sortAll, activeChBg, activeScBg, displayNone };
export type { Book, Form, FormData };
