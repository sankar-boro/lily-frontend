const deleteSection = (section: any) => {
    const deleteIds: any = [];
    let updateData = {};
    let deleteData = {};
    const { child, uniqueId } = section;
    child.forEach((section: any) => {
        deleteIds.push(section.uniqueId);
    });
    deleteIds.push(uniqueId);
    console.log(deleteIds);
}

export default deleteSection;