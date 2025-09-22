import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { createWrapper } from "next-redux-wrapper";
import { reducer as DashboardReducer } from "./dashboard";

const reducers = combineReducers({
  dashboard: DashboardReducer,
});

// Only add logger in development
const middlewares = [thunkMiddleware, promiseMiddleware];

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// Use compose for better performance
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
);

const makeStore = () => store;

// Use the new createWrapper API
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV === "development",
});
