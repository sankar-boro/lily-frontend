import axios from "axios";
import { Result, Ok, Err, Some } from "ts-results";

const log = true;
const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";

const updateOrDelete = (data: any, bookId: string) => {
  if (log) {
    console.log(data);
    return;
  }
  axios.post(UPDATE_OR_DELETE, {
    bookId,
    json: JSON.stringify(data),
  }, {
    withCredentials: true,
  });
}

const deletePage = (context: any): Result<string, string> => {
  const {activePage, apiData, bookId} = context;
  if (!apiData) return Err("!apiData");
  if (!activePage) return Err("!activePage");
  
  if (activePage.length === 1) return Err('Cannot delete');

  const deleteIds = [];

  activePage.child.forEach((section: any) => {
    deleteIds.push(section.uniqueId);
    section.child.forEach((subSection: any) => {
      deleteIds.push(subSection.uniqueId);
    });
  });
  deleteIds.push(activePage.uniqueId);

  const totalChapters = apiData.length;
  const activePageId = activePage.uniqueId;
  let childData: any = null;
  let parentData: any = null;

  for (let i=0; i < totalChapters; i++) {
    if (!apiData[i]) return Err(`!apiData[i]`);
    if (!apiData[i].uniqueId) return Err(`!apiData[i].uniqueId`);
    if (apiData[i].uniqueId === activePageId) {
      if (apiData[i+1]) {
        childData = Some(apiData[i + 1]);
      }
      break;
    }
    parentData = Some(apiData[i]);
  }

  let updateData = null;
  let deleteData = deleteIds;

  if (parentData && childData) {
    updateData = {
      topUniqueId: parentData.uniqueId,
      botUniqueId: childData.uniqueId
    }
  };

  updateOrDelete({updateData, deleteData}, bookId);

  return Ok("Success.");
}


export {
  deletePage
};