import { Chapter as ChapterData, Section as SectionData, ApiData } from "../../globals/types";
import { Ok, Err, Option, Some, None, Result } from "ts-results";

type UniqueId = string;


class SectionImpl {
    node: SectionData;

    constructor(section: SectionData) {
        this.node = section;
    }

    getChildIds(): UniqueId[] {
        let ids: UniqueId[] = [];
        this.node.child.forEach((subSection) => {
            ids.push(subSection.uniqueId);
        });
        return ids;
    }

    allIdsFromSection(ids: UniqueId[]) {
        ids.push(this.node.uniqueId); // section id
        this.node.child.forEach((subSection) => {
            ids.push(subSection.uniqueId); // sub section id
        });
    }
}

export const Section = SectionImpl as typeof SectionImpl & (<T>(d: T) => SectionType);
export type SectionType = SectionImpl;

class PageImpl {
    
    node: ChapterData;

    constructor(chapter: ChapterData) {
        this.node = chapter;
    }

    allIdsFromPage(ids: UniqueId[]) {
        ids.push(this.node.uniqueId); // page id
        this.node.child.forEach((section) => {
            Section(section).allIdsFromSection(ids);
        });
    }
}


export const Page = PageImpl as typeof PageImpl & (<T>(d: T) => PageType);
export type PageType = PageImpl;


class ApiDataImpl {
    node: ApiData
    length: number;

    constructor(apiData: ApiData) {
        this.node = apiData;
        this.length = apiData.length;
    }

    getAdjacentFromPage(activePageId: string): Result<any, string> {
        const { node} = this;
        let topPageData: Option<any> = None;
        let botPageData: Option<any> = None;

        for (let i=0; i < this.length; i++) {
            if (!node[i]) return Err(`!node[i]`);
            if (!node[i].uniqueId) return Err(`!node[i].uniqueId`);
            if (node[i].uniqueId === activePageId) {
                if (node[i+1]) {
                    botPageData = Some(node[i + 1]);
                    // deleteType = "deleteUpdate";
                } else {
                    // deleteType = "deleteOnly";
                }
                break;
            }
            topPageData = Some(node[i]);
        }

        return Ok({
            success: true,
            data: {
                topPageData,
                botPageData
            }
        })
    }
}