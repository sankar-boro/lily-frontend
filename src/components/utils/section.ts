import { Section as SectionData, Node } from "../../globals/types";

type SubSection = Node;
type SubSectionId = string;

class SectionImpl {
    
    section: SectionData

    constructor(section: SectionData) {
        this.section = section;
    }

    getSubSections(): SubSection[] {
        return this.section.child.map((subSection) => {
            return subSection;
        });
    }

    getSubSectionIds(): SubSectionId[] {
        return this.section.child.map((subSection) => {
            return subSection.uniqueId;
        });
    }
}


export const Section = SectionImpl as typeof SectionImpl & (<T>(t: T) => SectionType);
export type SectionType = SectionImpl;
