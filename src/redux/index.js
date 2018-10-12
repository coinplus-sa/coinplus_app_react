import { createStore, combineReducers } from "redux";
import inputs from "./reducers/inputs";

export default () => {
  const reducer = combineReducers({ inputs });
  const store = createStore(reducer);

  return store;
};
