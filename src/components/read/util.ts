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

const sortAll = (data: Book[], parentId: string) => {
    let newData: any = [];
    let parentNodeId = "";
    data.forEach((b) => {
        if (b.identity === 101) {
            newData.push({ ...b });
            parentNodeId = b.uniqueId;
        }
    });
    let totalLength = 1;
    data.forEach((d) => {
        if (d.identity === 104) {
            // newData.push({ ...d, child: [] });
            totalLength += 1;
        }
    });
    let looped = 1;
    while (looped !== totalLength) {
        // eslint-disable-next-line no-loop-func
        data.forEach((d) => {
            if (d.identity === 104 && d.parentId === parentNodeId) {
                newData.push({ ...d, child: [] });
                parentNodeId = d.uniqueId;
            }
        });
        looped += 1;
    }
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
            let { child } = d;
            child.forEach((c: any) => {
                data.forEach((dd: any) => {
                    if (dd.parentId === c.uniqueId && dd.identity === 105) {
                        child.push({ ...dd, child: [] });
                    }
                });
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                let currentParentId = c.uniqueId;

                data.forEach((dd: any) => {
                    if (
                        dd.identity === 106 &&
                        dd.parentId === currentParentId
                    ) {
                        c.child.push(dd);
                        currentParentId = dd.uniqueId;
                    }
                });
            });
        }
    });
    return newData;
};

const activeChBg = (c: any, a: string) => {
    let color = "white";
    if (c.uniqueId === a) {
        color = "#eff0f1";
    }
    return {
        backgroundColor: color,
    };
};
const activeScBg = (c: any, a: string) => {
    if (c.uniqueId === a) {
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

export { sortAll, activeChBg, activeScBg, displayNone };
export type { Book };
