import { Option } from "ts-results";

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

export type { Form, FormData };
