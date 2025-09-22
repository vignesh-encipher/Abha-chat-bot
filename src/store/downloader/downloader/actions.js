import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getDownLoadersList = createActionThunk(
  "GET_DOWN_LOADERS_LIST",
  network.downLoadersList
);
export const getOneDownLoadersList = createActionThunk(
  "GET_ONE_DOWN_LOADERS_LIST",
  network.oneDownLoadersList
);
export const getUploadFiles = createActionThunk(
  "GET_UPLOAD_FILES",
  network.uploadFiles
);
export const getBulkUploadFiles = createActionThunk(
  "GET_BULK_UPLOAD_FILES",
  network.bulkUploadFiles
);
export const getBlobUrl = createActionThunk(
  "GET_UPLOAD_FILES_BLOB_URL",
  network.uploadFilesBlobUrl
);
export const getNotComplete = createActionThunk(
  "GET_NOT_COMPLETE_DATA",
  network.notCompleteAPI
);
export const getAllDownLoadersList = createActionThunk(
  "GET_ALL_DOWN_LOADERS_LIST",
  network.allDownLoadersList
);
// save and next
export const saveAndNext = createActionThunk(
  "SAVE_AND_NEXT",
  network.nextCall
);
// delete file
export const getDeleteFile = createActionThunk(
  "DELETE_FILE",
  network.deleteFile
);
export const getBulkComplete = createActionThunk(
  "GET_BULK_COMPLETE",
  network.getBulkComplete
);