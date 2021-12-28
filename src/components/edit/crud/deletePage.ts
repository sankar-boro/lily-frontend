import axios, { AxiosError, AxiosResponse } from "axios";
import { Result, Ok, Err } from "ts-results";

const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";
const test = false;

const updateOrDelete = (url: string, data: any) => {
    axios.post(url, data, {
        withCredentials: true,
    });
}

class Data {
    parent: any = null;
    context: any = null;
    apiData: any = null;
    activePage: any = null;
    activeSection: any = null;

    inner: any = null;
    length: any = null;
    section: any = [];
    isTrue = false;

    constructor() {
        return this;
    }

    setContext(context: any) {
        this.context = context;
    }

    setApiData(apiData: any) {
        this.apiData = apiData;
    }

    setActivePage(activePage: any) {
        this.activePage = activePage;
    }

    setActiveSection() {
        const { apiData, activePage } = this.context;
        let _parent = null;
        apiData.forEach((chapter: any) => {
            chapter.child.forEach((section: any) => {
                if (section.uniqueId === activePage.uniqueId) {
                    _parent = chapter;
                }
            });
        });
        this.activeSection = activePage;
        this.parent = _parent;
    }
}

enum DeletePageError {
    ActivePageNotSet = "ActivePageNotSet",
    SectionsEmpty = "SectionsEmpty",
    NothingToDelete = "NothingToDelete",
};

class DeletePage extends Data {

    createDeleteIdsFrom104() : Result<string[], DeletePageError> { // page | chapter
        if (!this.activePage) return Err(DeletePageError.ActivePageNotSet);
        if (!this.activePage.child) return Err(DeletePageError.SectionsEmpty);

        const deleteIds = [];
        let sections = this.activePage.child;
        sections.forEach((section: any) => {
            section.child.forEach((subSection: any) => {
                deleteIds.push(subSection.uniqueId); // push subSection
            });
            deleteIds.push(section.uniqueId); // push section
        });
        deleteIds.push(this.activePage.uniqueId); // push the page id
        
        if (deleteIds.length === 0) {
            return Err(DeletePageError.NothingToDelete);
        }
        return Ok(deleteIds); // ids include [pageId, sectionId, subSectionId]
    }

    createAdjacentChaptersFromActivePage() : Result<AdjacentPages, string> {
        const { apiData, activePage } = this;
        let parentPage = null;
        let nextPage = null;

        let totalPages = apiData.length;
        let lastChapterIndex = totalPages - 1;
        let deleteType = null;
        if (!activePage) return Err("activePage not set");
        if(!activePage.uniqueId) return Err("missing active page uniqueId.");
        if (totalPages <= 1) return Err("cannot delete chapter.");

        for (let i=0; i <= lastChapterIndex; i++) {
            if (!apiData[i]) return Err(`no data from index: ${i}`);
            if (apiData[i].uniqueId === activePage.uniqueId) {
                if (apiData[i+1]) {
                    deleteType = "deleteUpdate";
                    nextPage = apiData[i + 1];
                } else {
                    deleteType = "deleteOnly";
                }
                break;
            }
            parentPage = apiData[i];
        }

        if (!parentPage) return Err("cannot delete page if parentPage does not exist.");

        // parentPage will never be null, nextPage could be null.
        return Ok({
            parentPage,
            nextPage
        });
    }

    run() {}
}

interface AdjacentPages {
    parentPage: any | null;
    nextPage: any | null;
}

interface AdjacentIds {
    nextChapterUId: string | null,
    parentChapterUId: string | null,
}

const getAdjacentIds = (pages: AdjacentPages) => {
    const { parentPage, nextPage } = pages;
    let nextChapterUId = nextPage ? nextPage.uniqueId : null;
    let parentChapterUId = parentPage ? parentPage.uniqueId : null;
    return {
        nextChapterUId,
        parentChapterUId,
    }    
}

const adjacentIdsToTopAndBotIds = (ids: AdjacentIds) => {
    const { nextChapterUId, parentChapterUId } = ids;
    let updateData = null;
    if (nextChapterUId !== null && parentChapterUId !== null) {
        return {
            topUniqueId: parentChapterUId,
            botUniqueId: nextChapterUId,
        }
    }
    return updateData;
}

const deletePage = (context: any) => {
    const {activePage, apiData, bookId} = context;
    let deletePage = new DeletePage();
    deletePage.setActivePage(activePage);
    let _deleteIds: Result<string[], DeletePageError> = deletePage.createDeleteIdsFrom104();
    if (_deleteIds.err) {
        console.log("Could not delete page. Cause: ", _deleteIds.val);
        return;
    }
    let deleteIds = _deleteIds.unwrap();

    deletePage.setApiData(apiData);
    let adjacentPages: Result<AdjacentPages, string> = deletePage.createAdjacentChaptersFromActivePage();
    if (adjacentPages.err) {
        console.log("Could not delete page. Cause: ", adjacentPages.val);
        return;
    }
    let adjacentIds = getAdjacentIds(adjacentPages.unwrap());
    let updateData = adjacentIdsToTopAndBotIds(adjacentIds);

    const deleteData = deleteIds;
    const toJson = JSON.stringify({
        updateData,
        deleteData,
        // deleteType,
    });
    const update_delete_data = {
        bookId,
        json: toJson,
    }
    
    // test logger
        if (test) {
            console.log({
                updateData,
                deleteData
            });
        }
        apiData.forEach((chapter: {uniqueId: string}) => {
            console.log(chapter.uniqueId);
        });
        if (test) {
            return;
        }
    //

    updateOrDelete(UPDATE_OR_DELETE, update_delete_data);
}


export default deletePage;
// all possible error handled.