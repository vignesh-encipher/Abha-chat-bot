import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { createWrapper } from "next-redux-wrapper";
import { reducer as TableReducer } from "./table";

// Import logger for development
import { logger } from "redux-logger";

const reducers = combineReducers({
  table: TableReducer,
});

// Only add logger in development
const middlewares = [thunk, promiseMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// Use compose for better performance
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const makeStore = () => createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
);

// Use the createWrapper API for version 8.0.0
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV === "development",
});
