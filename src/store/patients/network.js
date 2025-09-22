import { getStorage } from "@/utils/storages";
import { requestPortal, requestPortalFileDownload, requestPortalFiles } from "../../utils/network";

export async function getPatientsList({ pageNumber, searchText }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `patient/get-all?page=${pageNumber}&size=10&searchString=${searchText}`,
    options
  );
  return data;
}
export async function createPatients({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`patient/save`, options);
  return data;
}
// triggerPatient
export async function triggerPatient({ patientId }) {
  const options = {
    method: "POST",
  };
  const data = await requestPortal(
    `patient/trigger?patientId=${patientId}`,
    options
  );
  return data;
}
export async function downloadPatientReport({ patientId }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortalFileDownload(
    `patient/generate-report?patientId=${patientId}`,
    options
  );
  return data;
}

// uploadPatients
export async function uploadPatients({ obj }) {
  const options = {
    method: "POST",
    body: obj,
  };
  const data = await requestPortalFiles(`file/upload-file`, options);
  return data;
}
// getSinglePatient
export async function getSinglePatient() {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `patient/get-one?patientId=${patientId}`,
    options
  );
  return data;
}
// getPatientDisease
export async function getPatientDisease() {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `patient/compute/get-one?patientId=${patientId}`,
    options
  );
  return data;
}
export async function getPatientDetails() {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `patient/get-one?patientId=${patientId}`,
    options
  );
  return data;
}
export async function getPatientFiles(blobName) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `file/get-file?blobName=${blobName}`,
    options
  );
  return data;
}

export async function getDXICDList({ code }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(`code/find-icd?icd=${code}`, options);
  return res;
}
export async function getDXCPTList({ code }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(`code/find-cpt?cpt=${code}`, options);
  return res;
}

export async function getDXCodeAddEdit({ obj, isEdit }) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const url = isEdit ? "edit" : "add-code";
  const data = await requestPortal(`patient/compute/${url}`, options);
  return data;
}

