import { createAction } from "redux-actions";
import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const getPatientsList = createActionThunk(
  "GET_PATENTS_LIST",
  network.getPatientsList
);
export const createPatients = createActionThunk(
  "CREATE_PATIENTS",
  network.createPatients
);

export const  uploadPatients = createActionThunk(
  "UPLOAD_PATIENTS",
  network.uploadPatients
);
// triggerPatient
export const triggerPatient = createActionThunk(
  "TRIGGER_PATIENTS",
  network.triggerPatient
);
export const downloadPatientReport = createActionThunk(
  "DOWNLOAD_PATIENTS_REPORT",
  network.downloadPatientReport
);
export const getSinglePatient = createActionThunk(
  "SINGLE_PATIENT_DATA",
  network.getSinglePatient
);
export const getPatientDisease = createActionThunk(
  "SINGLE_PATIENT_DISEASES",
  network.getPatientDisease
);

export const getPatientDetails = createActionThunk(
  "SINGLE_PATIENT_DETAILS",
  network.getPatientDetails
);
export const getPatientFile = createActionThunk(
  "SINGLE_PATIENT_FILES",
  network.getPatientFiles
);
export const getDXICDList = createActionThunk(
  "GET_DX_ICD_LIST",
  network.getDXICDList
);
export const getDXCPTList = createActionThunk(
  "GET_DX_CPT_LIST",
  network.getDXCPTList
);
export const getDXCodeAddEdit = createActionThunk(
  "GET_DX_ICD_AND_CPT_ADD_EDIT",
  network.getDXCodeAddEdit
);
export const getSelectedDosPageNumber = createAction(
  "GET_SELECTED_DOS_PAGE_NUMBER"
);