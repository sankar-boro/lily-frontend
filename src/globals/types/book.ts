type Node = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    parentId: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
};

type Section = {
    bookId: string;
    body: string;
    child: Node[],
    identity: number;
    title: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

type Chapter = {
    bookId: string;
    body: string;
    child: Section[],
    identity: number;
    title: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

type ApiData = Chapter[];

export type { Node, Section, Chapter, ApiData };
