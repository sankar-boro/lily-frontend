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

const deleteSectionMain = (props: any) => {
    const { activePage, context } = props;
    const { bookId } = context;
    let prevData: any = null;
    let nextData: any = null;
    let found = false;
    if (activePage.identity === 105) {
        const s = context.apiData.forEach((f: any) => {
            f.child.forEach((e: any, index: number) => {
                if (found) {
                    nextData = e;
                    found = false;
                }
                if (activePage.uniqueId === e.uniqueId) {
                    if (index === 0) {
                        prevData = f;
                        found = true;
                    }
                    if (index !== 0) {
                        prevData = f.child[index - 1];
                        found = false;
                    }
                }
            });
        });
    }

    if (nextData && nextData.uniqueId && prevData && prevData.uniqueId) {
        let updateData = {
            uniqueId: nextData.uniqueId,
            newParentId: prevData.uniqueId,
        }

        let deleteData: any = [];
        activePage.child.forEach((e: any) => {
            deleteData.push({
                uniqueId: e.uniqueId
            });
        });
        let dd = {
            bookId,
            data: JSON.stringify({ updateData, deleteData }),
        };
        let url = "http://localhost:8000/book/delete/main_section"
        _deleteSection(dd, url);
    }
} 

const deletePage = (props: any) => {
    // console.log('deletePage',props);
    const { activePage, context } = props;
    if (activePage.identity === 105) {
        deleteSectionMain(props);
    }
}

export {
    deleteSection,
    deletePage,
}