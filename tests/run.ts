const data = require("./raw.json");
const fs = require("fs");

class Data {
    inner = null;
    lastIndex = null;
    constructor(_data) {
        this.inner = _data;
        this.lastIndex = this.inner.length - 1;
    }
}

class DeleteChapter extends Data {

    init() {
        this.inner.map((chapter, index) => index === 0 ? chapter.delete = false : chapter.delete = true);
    }

    peekNextChapter(index) {
        if (this.inner[index + 1]) return this.inner[index + 1];
        return null;
    }

    deleteChapterData() {
        this.inner.map((chapter, index) => {
            let c = chapter;
            c.deleteData = {};
            if (index === this.lastIndex && c.delete === true) {
                c.deleteData.tag = "deleteOnly";
                c.deleteData.deleteId = c.uniqueId;
            } else if (c.delete === true) {
                c.deleteData.tag = "deleteUpdate";
                c.deleteData.deleteId = c.uniqueId;
                c.deleteData.topId = c.parentId;
                const nextChapter = this.peekNextChapter(index);
                c.deleteData.botId = nextChapter ? nextChapter.uniqueId : null;
            }
            return c;
        });
    }
    run() {
        this.init();
        this.deleteChapterData();
        return this.inner;
    }
}

const a = new DeleteChapter(data).run();

class CreateChapter extends Data {

    peekNextChapter(index) {
        if (this.inner[index + 1]) return this.inner[index + 1];
        return null;
    }

    createChapterData() {
        this.inner.map((chapter, index) => {
            let c = chapter;
            c.createData = {};
            if (index === this.lastIndex) {
                c.createData.tag = "createOnly";
                c.createData.topId = chapter.uniqueId;
            } else {
                c.createData.tag = "createUpdate";
                c.createData.topId = chapter.uniqueId;
                let nextChapter = this.peekNextChapter(index);
                c.createData.botId = nextChapter ? nextChapter.uniqueId : null;
            }
            return c;
        })
    }

    run() {
        this.createChapterData();
        return this.inner;
    }
}

const b = new CreateChapter(a).run();

class ChapterData {
    chapter = null;
    sectionsLength = null;
    sections = [];
    sectionLastIndex = null;
    constructor(data) {
        this.chapter = data;
        if (Array.isArray(this.chapter.child) && this.chapter.child.length > 0) {
            this.sections = this.chapter.child;
            this.sectionsLength = this.chapter.child.length;
            this.sectionLastIndex = this.sectionsLength - 1;
        }
        return this;
    }

    initSection() {
        if (this.sectionsLength === null) {
            this.chapter.newSection = {
                topId: this.chapter.uniqueId,
                tag: "createOnly",
            };
        } else {
            this.chapter.newSection = {
                topId: this.chapter.uniqueId,
                botId: this.sections[0].uniqueId,
                tag: "createUpdate"
            };
        }
    }

    get() {
        this.initSection();
        this.chapter.child = this.sections;
        return this.chapter;
    }
    
}

class Section extends Data {

    sections = null;

    peekNextSection(index) {
        if (this.sections[index + 1]) return this.sections[index + 1];
        return null;
    }

    createSectionDeleteData() {
        this.inner.map((_chapter) => {
            let chapter = new ChapterData(_chapter);
            if (!chapter.sectionsLength) return chapter.get();
            this.sections = chapter.sections; // needed for peekNextSection
            let parentId = _chapter.uniqueId;
            let newSections = chapter.sections.map((_section, sectionIndex) => {
                let section = _section;
                section.deleteData = {};
                if (sectionIndex === chapter.sectionLastIndex) {
                    section.deleteData.tag = "deleteOnly";
                    section.deleteData.deleteId = section.uniqueId;
                } else {
                    section.deleteData.tag = "deleteUpdate";
                    section.deleteData.deleteId = _section.uniqueId;
                    section.deleteData.topId = parentId;
                    const nextSection = this.peekNextSection(sectionIndex);
                    section.deleteData.botId = nextSection ? nextSection.uniqueId : null;
                }
                parentId = _section.uniqueId;
                return section;
            });
            chapter.sections = newSections;
            return chapter.get();
        });
    }

    // :TODO
    createSectionCreateData() {
        this.inner.map((_chapter) => {
            let chapter = new ChapterData(_chapter);
            if (!chapter.sectionsLength) return chapter.get();
            this.sections = chapter.sections; // needed for peekNextSection
            chapter.sections.map((_section, sectionIndex) => {
                let newSection = _section;
                newSection.createData = {};
                if (sectionIndex === chapter.sectionLastIndex) {
                    newSection.createData.tag = "createOnly";
                    newSection.createData.topId = newSection.uniqueId;
                } else {
                    newSection.createData.tag = "createUpdate";
                    newSection.createData.topId = newSection.uniqueId;
                    const nextSection = this.peekNextSection(sectionIndex);
                    newSection.createData.botId = nextSection ? nextSection.uniqueId : null;
                }
                return newSection;
            });
            return chapter.get();
        });
    }

    run() {
        this.createSectionDeleteData();
        this.createSectionCreateData();
        return this.inner;
    }
}

const c = new Section(b).run();

class SectionData {
    section = null;
    subSectionsLength = null;
    subSections = [];
    subSectionLastIndex = null;
    constructor(data) {
        this.section = data;
        if (Array.isArray(this.section.child) && this.section.child.length > 0) {
            this.subSections = this.section.child;
            this.subSectionsLength = this.section.child.length;
            this.subSectionLastIndex = this.subSectionsLength - 1;
        }
        return this;
    }

    initSection() {
        if (this.subSectionsLength === null) {
            this.section.newSection = {
                topId: this.section.uniqueId,
                tag: "createOnly",
            };
        } else {
            this.section.newSection = {
                topId: this.section.uniqueId,
                botId: this.subSections[0].uniqueId,
                tag: "createUpdate"
            };
        }
    }

    get() {
        this.initSection();
        this.section.child = this.subSections;
        return this.section;
    }
    
}

class SubSection extends Data {

    subSections = null;

    peekNextSection(index) {
        if (this.subSections[index + 1]) return this.subSections[index + 1];
        return null;
    }

    createSectionDeleteData() {
        this.inner.map((_chapter) => {
            let chapter = _chapter.child.map((_section, sectionIndex) => {
                let section = new SectionData(_section);
                if (!section.subSectionsLength) return section.get();
                this.subSections = section.subSections;
                let parentId = _section.uniqueId;
                let __subSections = section.subSections.map((_subSection, _subSectionIndex) => {
                    let subSection = _subSection;
                    subSection.deleteData = {};
                    if (_subSectionIndex === section.subSectionLastIndex) {
                        subSection.deleteData.tag = "deleteOnly";
                        subSection.deleteData.deleteId = subSection.uniqueId;
                    } else {
                        subSection.deleteData.tag = "deleteUpdate";
                        subSection.deleteData.deleteId = _subSection.uniqueId;
                        subSection.deleteData.topId = parentId;
                        const nextSubSection = this.peekNextSection(_subSectionIndex);
                        subSection.deleteData.botId = nextSubSection ? nextSubSection.uniqueId : null;
                    }
                    parentId = subSection.uniqueId;
                    return subSection;
                });
                section.subSections = __subSections;
                return section.get();
            });
            return chapter;
        });
    }

    // :TODO
    createSectionCreateData() {
        this.inner.map((_chapter) => {
            let chapter = _chapter.child.map((_section, _sectionIndex) => {
                let section = new SectionData(_section);
                if (!section.subSectionsLength) return section.get();
                this.subSections = section.subSections;
                let __subSection = _section.child.map((_subSection, _subSectionIndex) => {
                    let newSubSection = _subSection;
                    newSubSection.createData = {};
                    if (_subSectionIndex === section.subSectionLastIndex) {
                        newSubSection.createData.tag = "createOnly";
                        newSubSection.createData.topId = newSubSection.uniqueId;
                    } else {
                        newSubSection.createData.tag = "createUpdate";
                        newSubSection.createData.topId = newSubSection.uniqueId;
                        const nextSubSection = this.peekNextSection(_subSectionIndex);
                        newSubSection.createData.botId = nextSubSection ? nextSubSection.uniqueId : null;
                    }
                    return newSubSection;
                });
                section.subSections = __subSection;
                return section.get();
            });
            return chapter;
        });
    }

    run() {
        this.createSectionDeleteData();
        this.createSectionCreateData();
        return this.inner;
    }
}

const d = new SubSection(b).run();


// TODO: .get()