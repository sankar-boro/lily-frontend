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

type BookData = {
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
}

enum FORM_TYPE {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
}

enum ID_TYPES {
    BOOK = "BOOK",
    ACTIVE = "ACTIVE",
    SECTION = "SECTION",
    EDIT_SUB_SECTION = "EDIT_SUB_SECTION",
    PARENT = "PARENT",
    FORM = "FORM"
}

type Form = {
    formType: FORM_TYPE;
    formData: Option<FormData>;
};

export type { Form, FormData, Book };
export { FORM_TYPE, ID_TYPES };
