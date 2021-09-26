import axios, { AxiosError, AxiosResponse } from "axios";

// "http://localhost:8000/book/section/delete",

const _delete = (data: any, url: string) => {
    axios.post(url, data, {
        withCredentials: true,
    });
}

const _deleteSection = (data: any, url: string) => {
    axios.post(url, data, {
        withCredentials: true,
    });
}

const deleteLastElement = (props: {
    totalSections: number, bookId: string, sectionIndex: number, uniqueId: string
}) => {
    const { totalSections, bookId, sectionIndex, uniqueId } = props;
    let lastIndex = totalSections - 1;
    if (sectionIndex === lastIndex && totalSections > 0) {
        let url = "http://localhost:8000/book/delete/sub_section/last";
        _delete({
            bookId,
            uniqueId,
        }, url);
    }
}

const deleteFirstElement = (props: {
    sections: any,
    sectionIndex: number,
    activePage: any,
    bookId: string,
    uniqueId: string,
    section: any
}) => {
    const { sectionIndex, activePage, section, bookId, sections } = props;
    const activePageUniqueId = activePage.uniqueId;

    let deleteData = {
        bookId,
        deleteUniqueId: "",
    };

    if (sectionIndex === 0) {
        deleteData.deleteUniqueId = section.uniqueId;

        if (sections.length >= 1) {        
            let updateData = {
                bookId,
                uniqueId: "",
                newParentId: "",
            };
            const nextSection = sections[sectionIndex + 1];
            updateData.uniqueId = nextSection.uniqueId;
            updateData.newParentId = activePageUniqueId;

            let url = "http://localhost:8000/book/delete/sub_section/first";
            _deleteSection({
                data: JSON.stringify({updateData, deleteData})
            }, url);
        }
    }
}

const deleteAnySection = (props: any) => {
    const { sectionIndex, sections, bookId, section } = props;
    if (sectionIndex > 0 && sections.length > 0) {
        let deleteData = {
            bookId,
            deleteUniqueId: section.uniqueId
        }
        const nextSection = sections[sectionIndex + 1];
        const prevSection = sections[sectionIndex - 1];
        if (nextSection && prevSection) {
            const updateData = {
                bookId,
                uniqueId: nextSection.uniqueId,
                newParentId: prevSection.uniqueId,
            }

            const d = {
                updateData,
                deleteData,
            }

            let url = "http://localhost:8000/book/delete/sub_section/first";
            _deleteSection({
                data: JSON.stringify(d)
            }, url);
        }
    }
}

const deleteSection = (props: any) => {
    const { activePage, sectionIndex, section, sections, bookId } = props;
    const totalSections = sections.length;
    const uniqueId = section.uniqueId;
    const lastIndex = totalSections - 1;
    if (sectionIndex === lastIndex) {
        deleteLastElement({
            totalSections,
            bookId,
            sectionIndex,
            uniqueId,
        });
        return;
    }

    if (sectionIndex === 0) {
        deleteFirstElement(props);
        return;
    }


    deleteAnySection(props);
}

export {
    deleteSection,
}