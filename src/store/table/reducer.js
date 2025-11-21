import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { tableAction, tableActionChat,chatResponse } from "./actions";

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

const rootReducer = combineReducers({
  table: createReducer(tableAction),
  tableChat: createReducer(chatResponse),
});

export default rootReducer;
