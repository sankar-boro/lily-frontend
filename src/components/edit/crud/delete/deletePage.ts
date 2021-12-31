import axios from "axios";
import { Result, Ok, Err, Some, None, Option } from "ts-results";
import { ENV, URLS} from "../../../../globals/constants";
import { Book } from "../../../../globals/types";

const updateOrDelete = (data: any, bookId: string) => {
    if (ENV.LOG) {
        console.log(data);
        return;
    }
    axios.post(URLS.UPDATE_OR_DELETE, {
        bookId,
        json: JSON.stringify(data),
    }, {
        withCredentials: true,
    });
}

type ActivePage = {
    child?: any [],
    uniqueId?: string,
}

interface AdjacentPageData {
    topPageData: Option<Book>;
    botPageData: Option<Book>;
}

interface AdjacentPageId {
    topPageUId: Option<string>,
    botPageUId: Option<string>,
}

type TopAndBotId =  {
    topUniqueId: string | null,
    botUniqueId: string | null,
}

type ApiData = Book[];


class DeletePage {

    activePage: ActivePage;
    apiData: ApiData;
    sections: Option<any[]> = None;
    activePageId: Option<string> = None;

    deletePageIds: Option<string[]> = None;
    updatePageData: Option<AdjacentPageData> = None;

    constructor(apiData: ApiData, activePage: ActivePage) {
        this.apiData = apiData;
        this.activePage = activePage;
    }

    private createDeleteIds(activePageId: string, sections: any[]) {
        const deletePageIds: string[] = [activePageId];
        sections.forEach((section: any) => {
            section.child.forEach((subSection: any) => {
                deletePageIds.push(subSection.uniqueId); // push subSection
            });
            deletePageIds.push(section.uniqueId); // push section
        });
        this.deletePageIds = Some(deletePageIds); // ids include [pageId, sectionId, subSectionId]
    }

    private createAdjacentDataFromActivePage(apiData: ApiData, activePage: ActivePage) : Result<string, string> {
        let topPageData: Option<any> = None;
        let botPageData: Option<any> = None;
        const activePageId = this.activePageId.unwrap();
        
        let totalPages = apiData.length;
        if (totalPages <= 1) return Err("Cannot delete chapter.");

        let lastChapterIndex = totalPages - 1;
        let deleteType = null;
        
        for (let i=0; i <= lastChapterIndex; i++) {
            if (!apiData[i]) return Err(`!apiData[i]`);
            if (!apiData[i].uniqueId) return Err(`!apiData[i].uniqueId`);
            if (apiData[i].uniqueId === activePageId) {
                if (apiData[i+1]) {
                    deleteType = "deleteUpdate";
                    botPageData = Some(apiData[i + 1]);
                } else {
                    deleteType = "deleteOnly";
                }
                break;
            }
            topPageData = Some(apiData[i]);
        }

        if (topPageData.none) {
            return Err("topPageData.none");
        } 
        this.updatePageData = Some({
            topPageData: topPageData,
            botPageData: botPageData,
        });
        return Ok("success");
    }

    init(): Result<string, string> {
        const { activePage } = this;
        if (!activePage.uniqueId) return Err("!uniqueId");
        this.activePageId = Some(activePage.uniqueId);

        if (!activePage.child) return Err("!activePage.child");
        this.sections = Some(activePage.child);

        return Ok("Success.");
    }

    run(): Result<string, string> {
        const init = this.init();
        if (init.err) return init;

        let { apiData, activePage, activePageId, sections } = this;
        let _sections = sections.some ? sections.val : [];
        this.createDeleteIds(activePageId.unwrap(), _sections);

        const adjacentIds =  this.createAdjacentDataFromActivePage(apiData, activePage);
        if (adjacentIds.err) return adjacentIds;
        return Ok("Success.");
    }

    getData() : Result<any, string> {
        
        let adjacentIds: Result<Option<AdjacentPageId>, string> = Ok(None);
        let topAndBotIds: Option<TopAndBotId> = None;

        if (this.updatePageData.some) {
            adjacentIds = getAdjacentIds(this.updatePageData.val);
            if (adjacentIds.err) return adjacentIds;
        }

        let _adjacentIds = adjacentIds.val;
        if(_adjacentIds.none) {
            const returnData = {
                deleteData: this.deletePageIds,
                updateData: null,
            };
            return Ok(returnData);    
        }

        topAndBotIds = adjacentIdsToTopAndBotIds(_adjacentIds.val);
        return Ok({
            deleteData: this.deletePageIds,
            updateData: topAndBotIds,
        }); 

    }
}

const getAdjacentIds = (adjacentPageData: AdjacentPageData): Result<Option<AdjacentPageId>, string> => {
    const { topPageData, botPageData } = adjacentPageData;
    if (topPageData.none) return Err("!topPageData");
    if (topPageData.some && botPageData.none) return Ok(None);

    let topPageUId = topPageData.some && topPageData.val.uniqueId ? Some(topPageData.val.uniqueId) : None;
    let botPageUId = botPageData.some && botPageData.val.uniqueId ? Some(botPageData.val.uniqueId) : None;
    return Ok(Some({
        topPageUId,
        botPageUId,
    }));    
}

const adjacentIdsToTopAndBotIds = (ids: AdjacentPageId): Option<TopAndBotId> => {
    const { botPageUId, topPageUId } = ids;
    if (!botPageUId && !topPageUId) return None;

    return Some({
        topUniqueId: topPageUId.some ? topPageUId.val : null,
        botUniqueId: botPageUId.some ? botPageUId.val : null,
    });
}

const deletePage = (context: any): Result<string, string> => {
    const {activePage, apiData, bookId} = context;
    if (!apiData) return Err("!apiData");
    if (!activePage) return Err("!activePage");

    const deletePage = new DeletePage(apiData, activePage);
    const runRes = deletePage.run();
    if( runRes.err) return runRes;
    
    let json = deletePage.getData();
    if (json.err) return json;

    updateOrDelete(json, bookId);
    return Ok("Success.");
}


export default deletePage;