import axios from "axios";
import { Result, Ok, Err } from "ts-results";
import { ENV, URLS} from "../../../../globals/constants";

const updateOrDelete = (data: any) => {
    if (ENV.LOG) {
        return ;
    }
    axios.post(URLS.UPDATE_OR_DELETE, data, {
        withCredentials: true,
    });
}

enum DeletePageError {
    ActivePageNotSet = "ActivePageNotSet",
    SectionsEmpty = "SectionsEmpty",
    NothingToDelete = "NothingToDelete",
};

type ActivePage = {
    child: any [],
    uniqueId: string,
}

interface AdjacentPageData {
    topPageData: any | null;
    botPageData: any | null;
}

interface AdjacentPageId {
    topPageUId: string | null,
    botPageUId: string | null,
}

type ApiData = any[];

class DeletePage {

    activePage: ActivePage | null = null;
    apiData: ApiData | null = null;

    deletePageIds: string[] = [];
    updatePageData: AdjacentPageData | null = null;
    updatePageId: AdjacentPageId | null = null;
    
    err: boolean | null = null;
    ok: boolean | null = null;
    val: any = null;

    setActivePage(activePage: ActivePage) {
        this.activePage = activePage;
        return this;
    }

    setApiData(apiData: ApiData) {
        this.apiData = apiData;
        return this;
    }

    private createDeleteIdsFrom104() : Result<string, string> { // page | chapter
        if (!this.activePage) return Err(DeletePageError.ActivePageNotSet);
        if (!this.activePage.child) return Err(DeletePageError.SectionsEmpty);

        const deletePageIds: string[] = [];
        let sections = this.activePage.child;
        sections.forEach((section: any) => {
            section.child.forEach((subSection: any) => {
                deletePageIds.push(subSection.uniqueId); // push subSection
            });
            deletePageIds.push(section.uniqueId); // push section
        });
        deletePageIds.push(this.activePage.uniqueId); // push the page id
        
        if (deletePageIds.length === 0) {
            return Err(DeletePageError.NothingToDelete);
        }

        this.deletePageIds = deletePageIds; // ids include [pageId, sectionId, subSectionId]
        return Ok("success");
    }

    private createAdjacentDataFromActivePage() : Result<string, string> {
        const { apiData, activePage } = this;
        let topPageData = null;
        let botPageData = null;

        if (!apiData) return Err("Cannot delete Page. No apiData.");

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
                    botPageData = apiData[i + 1];
                } else {
                    deleteType = "deleteOnly";
                }
                break;
            }
            topPageData = apiData[i];
        }

        if (!topPageData) return Err("cannot delete page if parentPage does not exist.");

        // parentPage will never be null, nextPage could be null.
        this.updatePageData = {
            topPageData,
            botPageData
        };

        return Ok("success");
    }

    error(val: any) {
        this.ok = false;
        this.err = true;
        this.val = val;
    }

    success() {
        this.ok = true;
        this.err = false;
    }

    run() {
        let res1 = this.createDeleteIdsFrom104();
        let res2 = this.createAdjacentDataFromActivePage();
        if (res1.err || res2.err) {
            if (res1.err) {
                this.error(res1.err);
            } else if (res2.err) {
                this.error(res2.err);
            }
        } else {
            this.success();
        }
        return this;
    }

    getData() : Result<any, string> {
        if (this.err) {
            return Err(this.val);
        } 
        let adjacentIds = getAdjacentIds(this.updatePageData);
        if (adjacentIds.err) {
            return Err(adjacentIds.val);
        }
        let topAndBotIds = adjacentIdsToTopAndBotIds(adjacentIds.unwrap());
        const returnData = {
            deleteData: this.deletePageIds,
            updateData: topAndBotIds
        };
        if (ENV.LOG) {
            this.apiData?.forEach((chapter) => {
                console.log('chapter', chapter.uniqueId);
            });
            console.log(returnData);
        }
        return Ok(returnData);
    }
}

const getAdjacentIds = (adjacentPageData: AdjacentPageData | null): Result<AdjacentPageId, string> => {
    if (!adjacentPageData) return Err("Adjacent Data not set.");
    const { topPageData, botPageData } = adjacentPageData;
    let topPageUId = topPageData ? topPageData.uniqueId : null;
    let botPageUId = botPageData ? botPageData.uniqueId : null;
    return Ok({
        topPageUId,
        botPageUId,
    })    
}

const adjacentIdsToTopAndBotIds = (ids: AdjacentPageId) => {
    const { botPageUId, topPageUId } = ids;
    let updateData = null;
    if (botPageUId !== null && topPageUId !== null) {
        // NOTE: 
        return {
            topUniqueId: topPageUId,
            botUniqueId: botPageUId
        }
    }
    return updateData;
}

const deletePage = (context: any) => {
    const {activePage, apiData, bookId} = context;
    const json = new DeletePage()
    .setActivePage(activePage)
    .setApiData(apiData)
    .run()
    .getData();
    updateOrDelete(json);
}


export default deletePage;
// all possible error handled.