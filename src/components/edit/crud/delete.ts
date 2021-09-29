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

const getPageProperties = () => {
    return {};
}

const deleteIds = (activePage: any) => {
    const ids = [];
    activePage.child.forEach((e: any) => {
        ids.push(e.uniqueId);
    });
    ids.push(activePage.uniqueId);
    return ids;
}

const do_ = (chapter: any, index: number) => {
    let sectionsLength = chapter.child.length;

    // if sectionsLength === 1, lastIndex = 0;
    let lastIndex = sectionsLength - 1;
    
    console.log(lastIndex, index);
    // If section to delete is last, there is nothing to update
    // if lastIndex === 5 && index === 5, there is nothing to update
    if (lastIndex === index) return null;

    // If there is only 1 section in this chapter there is nothing to update
    if (lastIndex === 0) return null;

    if (index < lastIndex) {
        let parentUId = chapter.uniqueId;
        if (index >= 1) {
            parentUId = chapter.child[index - 1].uniqueId;
        }
        let uniqueId = chapter.child[index + 1].uniqueId;
        return {
            uniqueId,
            newParentId: parentUId,
        }
    }
}

const updateData = (props: any) => {
    const { activePage, context } = props;
    const bookData = context.apiData;
    let r = null;
    bookData.forEach((chapter: any) => {
        chapter.child.forEach((section: any, index: number) => {
            if (section.uniqueId === activePage.uniqueId) {
                r = do_(chapter, index);
            }
        });
    });
    return r;
}

const deleteSectionMain = (props: any) => {
   const { activePage, context } = props;
   let a = deleteIds(activePage);
   let b = updateData(props);
   console.log(context.apiData);
   console.log(a);
   console.log('updateData', b);
} 

const deleteChapterIds = (activeChapter: any) => {
    const ids = [];
    activeChapter.child.forEach((section: any) => {
        section.child.forEach((subSection: any) => {
            ids.push(subSection.uniqueId);
        });
        ids.push(section.uniqueId);
    });
    ids.push(activeChapter.uniqueId);
    return ids;
}

const updateChapterIds = (props: any) => {
    const { context, activePage } = props;
    const chapters = context.apiData;
    let currentIndex: any = null;
    let prevChapter: any = null;
    let nextChapter: any = null;
    chapters.forEach((chapter: any, index: number) => {
        if (chapter.uniqueId === activePage.uniqueId && index !== 0) {
            currentIndex = index;
            prevChapter = chapters[index - 1];
        }
    });

    if (currentIndex && chapters[currentIndex + 1]) {
        nextChapter = chapters[currentIndex + 1];
    } else {
        return null;
    }

    if (nextChapter && prevChapter) {
        return {
            uniqueId: nextChapter.uniqueId,
            newParentId: prevChapter.uniqueId,
        }
    }
    
}

const deleteChapterMain = (props: any) => {
    const { activePage, context } = props;
    let d = deleteChapterIds(activePage);
    let u = updateChapterIds(props);
    console.log('deleteChapter', d);
    console.log('updateChapter', u);
}

const deletePage = (props: any) => {
    const { activePage, context } = props;
    console.log('deletePage', activePage);
    if (activePage.identity === 105) {
        deleteSectionMain(props);
    }

    if (activePage.identity === 104) {
        deleteChapterMain(props);
    }
}

export {
    deleteSection,
    deletePage,
}