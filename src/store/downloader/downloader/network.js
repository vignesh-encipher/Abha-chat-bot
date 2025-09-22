import { requestPortal, requestPortalFiles } from "@/utils/network";
import { getStorage } from "@/utils/storages";

export async function downLoadersList({
  pageNumber,
  searchText = "",
  selectedOption,
  size = 13,
  batchCount,
  practiceId,
  dob = "",
  allPatientIds = "",
  isDownloaderNotShow = true,
}) {
  const projectId = getStorage("projectId");
  const {
    provider = "",
    status = "",
    tin = "",
    assignedBy = "",
    practice = "",
    fileUploadedStatus = "",
  } = selectedOption;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/get-all-downloader?providerId=${
      provider || ""
    }&dob=${
      dob || ""
      
    }&projectId=${projectId}&page=${pageNumber}&size=${size}&searchString=${
      searchText || ""
    }&tinId=${tin}&downloaderProcessedStatus=${
      status || ""
    }&sortField=&sortDirection=&batchCount=${batchCount || ""}&practiceId=${
      practiceId || practice || ""
    }&downloaderAllocatedBy=${
      assignedBy || ""
    }&isDownloaderNotShow=${isDownloaderNotShow}&showPatientUploadedFiles=${
      fileUploadedStatus == "Yes"
        ? true
        : fileUploadedStatus == "No"
        ? false
        : ""
    }&allPatientIds=${allPatientIds}`,
    options
  );
  return res;
}
// one
export async function oneDownLoadersList({
  pageNumber = 0,
  searchText = "",
  selectedOption = {},
  size = 13,
  batchCount = "",
  practiceId = "",
  dob = "",
  patientId = "",
  isDownloaderNotShow = true,
}) {
  const projectId = getStorage("projectId");
  const { provider = "", status = "", tin = "", owner = "" } = selectedOption;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/get-all-downloader?patientId=${patientId}&providerId=${
      provider || ""
    }&dob=${
      dob || ""
    }&projectId=${projectId}&page=${pageNumber}&size=${size}&searchString=${
      searchText || ""
    }&tinId=${tin}&processedStatus=${
      status || ""
    }&sortField=&sortDirection=&batchCount=${batchCount || ""}&practiceId=${
      practiceId || ""
    }&downloaderAllocatedTo=${
      owner || ""
    }&isDownloaderNotShow=${isDownloaderNotShow}`,
    options
  );
  return res;
}
// allDownLoadersList
export async function allDownLoadersList({
  pageNumber = 0,
  searchText = "",
  selectedOption = {},
  size = 13,
  batchCount,
  practiceId,
  dob = "",
  isDownloaderNotShow = true,
}) {
  const projectId = getStorage("projectId");
  const { provider = "", status = "", tin = "", owner = "" } = selectedOption;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/get-all-downloader?providerId=${
      provider || ""
    }&dob=${
      dob || ""
    }&projectId=${projectId}&page=${pageNumber}&size=${size}&searchString=${
      searchText || ""
    }&tinId=${tin}&processedStatus=${
      status || ""
    }&sortField=&sortDirection=&batchCount=${batchCount || ""}&practiceId=${
      practiceId || ""
    }&downloaderAllocatedTo=${
      owner || ""
    }&allPatientIds=true&isDownloaderNotShow=${isDownloaderNotShow}`,
    options
  );
  return res;
}
// nextCall
export async function nextCall({
  pageNumber = 0,
  searchText = "",
  selectedOption = {},
  size = 13,
  batchCount,
  practiceId,
  dob = "",
  patientId = "",
  isDownloaderNotShow = true,
}) {
  const projectId = getStorage("projectId");
  const { provider = "", status = "", tin = "", owner = "" } = selectedOption;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/get-all-downloader?patientId=${patientId}&providerId=${
      provider || ""
    }&dob=${
      dob || ""
    }&projectId=${projectId}&page=${pageNumber}&size=${size}&searchString=${
      searchText || ""
    }&tinId=${tin}&processedStatus=${
      status || ""
    }&sortField=&sortDirection=&batchCount=${batchCount || ""}&practiceId=${
      practiceId || ""
    }&downloaderAllocatedTo=${
      owner || ""
    }&allPatientIds=true&isDownloaderNotShow=${isDownloaderNotShow}`,
    options
  );
  return res;
}
// deleteFile
export async function deleteFile({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/delete-file-id`,
    options
  );
  return res;
}
export async function getBulkComplete(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const res = await requestPortal(
    `manual-coding-db-service/patient/status/check-completed`,
    options
  );
  return res;
}

// uploadFiles
export async function uploadFiles({ formObj }) {
  const options = {
    method: "POST",
    body: formObj,
  };
  const res = await requestPortalFiles(
    `manual-coding-db-service/file/upload-file`,
    options
  );
  return res;
}
// bulkUploadFiles
export async function bulkUploadFiles({ formObj }) {
  const options = {
    method: "POST",
    body: formObj,
  };
  const res = await requestPortalFiles(
    `manual-coding-db-service/file/bulk-upload-file`,
    options
  );
  return res;
}
// uploadFilesBlobUrl
export async function uploadFilesBlobUrl({ pdfName }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `manual-coding-db-service/file/get-file?blobName=${pdfName}`,
    options
  );
  return res;
}
// notCompleteAPI
export async function notCompleteAPI({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const res = await requestPortal(
    `manual-coding-db-service/file/not-complete`,
    options
  );
  return res;
}
