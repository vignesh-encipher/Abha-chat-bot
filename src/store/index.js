import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { createWrapper } from "next-redux-wrapper";
import { reducer as patientsReducer } from "./patients";
import { reducer as downloadReducer } from "./downloader/downloader";

const reducers = combineReducers({
  patients: patientsReducer,
  downloadReducer: combineReducers({
    downloader: downloadReducer,
  }),
});

const middlewares = [thunkMiddleware, promiseMiddleware];

if (process.env.NEXT_PUBLIC_NODE_ENV !== "production") {
  // const { logger } = require("redux-logger");
  // middlewares.push(logger);
}

export const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewares))
);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
