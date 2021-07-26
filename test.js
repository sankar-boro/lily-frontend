const book_data = [
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        parentId: null,
        title: "Zodiac Signs Unique Personality Traits",
        identity: 101,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "e8fc02d6-e903-11eb-aeed-2b40c03503f7",
        parentId: "96900a01-ec36-11eb-a020-0dc483330b72",
        title: "Gemini (May 21 - June 20)",
        identity: 104,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "f1573609-e903-11eb-a919-bc4af2d5a51e",
        parentId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        title: "Aries (March 21 - April 19)",
        identity: 104,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "7d298f03-e904-11eb-bf99-57831fe8d347",
        parentId: "f1573609-e903-11eb-a919-bc4af2d5a51e",
        title: "Features of Aries",
        identity: 105,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "7f3bcee6-ec36-11eb-b032-7d3c88b4d073",
        parentId: "7d298f03-e904-11eb-bf99-57831fe8d347",
        title: "Intro to aries",
        identity: 105,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "96900a01-ec36-11eb-a020-0dc483330b72",
        parentId: "f1573609-e903-11eb-a919-bc4af2d5a51e",
        title: "Tauras",
        identity: 104,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "4b6b60f7-ed1a-11eb-9dee-d001bb3da4fa",
        parentId: "56febf8e-ed1a-11eb-b924-9e206efacd54",
        title: "Intro to Taurus",
        identity: 105,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "56febf8e-ed1a-11eb-b924-9e206efacd54",
        parentId: "96900a01-ec36-11eb-a020-0dc483330b72",
        title: "Features of Taurus",
        identity: 105,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "65184d27-ed1a-11eb-915b-f7988cb3efa3",
        parentId: "4b6b60f7-ed1a-11eb-9dee-d001bb3da4fa",
        title: "Hello Taurus",
        identity: 105,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "65184d27-ed1a-11eb-915b-f7988cb3efa4",
        parentId: "65184d27-ed1a-11eb-915b-f7988cb3efa3",
        title: "Taurus 1",
        identity: 106,
    },
    {
        bookId: "df9dded0-e903-11eb-a86f-a0a2f8d2f459",
        uniqueId: "65184d27-ed1a-11eb-915b-f7988cb3efa5",
        parentId: "65184d27-ed1a-11eb-915b-f7988cb3efa4",
        title: "Taurus 2",
        identity: 106,
    },
];

function groups() {
    let gs = {
        101: [],
        102: [],
        103: [],
        104: [],
        105: [],
        106: [],
    };

    book_data.forEach((d) => {
        if (gs[d.identity]) {
            gs[d.identity].push(d);
        }
    });
    return gs;
}

function groupSections(dd, s) {
    let pId = dd.uniqueId;
    let sections = [];
    let c = 0;

    let removeIds = [];
    let newIds = [];

    while (c !== s.length) {
        // eslint-disable-next-line no-loop-func
        s.forEach((ss) => {
            if (ss.parentId === pId) {
                sections.push(ss);
                pId = ss.uniqueId;
                removeIds.push(ss.uniqueId);
            }
        });
        c++;
    }

    s.forEach((ss) => {
        if (!removeIds.includes(ss.uniqueId)) {
            newIds.push(ss);
        }
    });

    return { data: { ...dd, child: sections }, newSections: newIds };
}

function buildSectionsReturnSections(chapters, sections, sub_sections) {
    let dynaSections = sections;
    return chapters.map((chapter) => {
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
            let buildSubSections = buildSections.data.child.map((sections_) => {
                let tempBuildSubSections = groupSections(
                    sections_,
                    dynaSubSections
                );
                dynaSubSections = tempBuildSubSections.newSections;
                return tempBuildSubSections.data;
            });

            buildSections.data.child = buildSubSections;
            return buildSections.data;
        }
        return buildSections.data;
    });
}

function run() {
    let gs = groups();
    let ozf = gs[105];
    let ozs = gs[106];

    let c = { 101: gs[101], 102: gs[102], 103: gs[103], 104: gs[104] };
    let chapters = [];
    Object.values(c).forEach((v) => {
        let a = buildSectionsReturnSections(v, ozf, ozs);
        chapters = [...chapters, ...a];
    });
    console.log(chapters, "\n\n");
}

run();
