import { Option } from "ts-results";

type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

type Book = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    parentId: string | null;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
};

enum VIEW_TYPE {
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
    formType: VIEW_TYPE;
    formData: Option<FormData>;
};

export type { Form, FormData, Book };
export { VIEW_TYPE };
