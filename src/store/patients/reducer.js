import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  getPatientsList,
  getSinglePatient,
  getPatientDisease,
  getPatientDetails,
  getPatientFile,
  getDXICDList,
  getDXCPTList,
  getDXCodeAddEdit,
  getSelectedDosPageNumber
} from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );
const getDetailsLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
  const getSelectedDetails = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );

const rootReducer = combineReducers({
  getPatientsList: createReducer(getPatientsList),
  patientsLoader: getDetailsLoading(getPatientsList),
  getSinglePatientData: createReducer(getSinglePatient),
  getSinglePatientLoader: getDetailsLoading(getSinglePatient),
  getPatientDiseaseData: createReducer(getPatientDisease),
  getPatientDiseaseLoader: getDetailsLoading(getPatientDisease),
  getPatientDetailsData: createReducer(getPatientDetails),
  getPatientDetailsLoader: getDetailsLoading(getPatientDetails),
  getPatientFileLoader: getDetailsLoading(getPatientFile),
  getDXICDList: createReducer(getDXICDList),
  getDXICDListLoader: getDetailsLoading(getDXICDList),
  getDXCPTList: createReducer(getDXCPTList),
  getDXCPTListLoader: getDetailsLoading(getDXCPTList),
  getDXCodeAddEdit: createReducer(getDXCodeAddEdit),
  getDXCodeAddEditLoader: getDetailsLoading(getDXCodeAddEdit),
   selectedDosPageNumber: getSelectedDetails(getSelectedDosPageNumber),
});

export default rootReducer;
