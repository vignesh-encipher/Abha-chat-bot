import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getDownLoadersList ,getNotComplete,getAllDownLoadersList, getBulkComplete} from "./actions";

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

const rootReducer = combineReducers({
  getList: createReducer(getDownLoadersList),
  loader: getDetailsLoading(getDownLoadersList),
  notCompleteLoader:getDetailsLoading(getNotComplete),
  allList:createReducer(getAllDownLoadersList),
  allListLoader:getDetailsLoading(getAllDownLoadersList),
  getBulkCompleteLoader:getDetailsLoading(getBulkComplete)
});

export default rootReducer;
