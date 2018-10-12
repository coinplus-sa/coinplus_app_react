import React from "react";
import { Provider } from "react-redux";
import { getTheme, StyleProvider } from "native-base";

import createStore from "./redux";
import StackNavigator from "./navigation/router";
import customVariables from "./variables";

const store = createStore();

export default () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(customVariables)}>
      <StackNavigator />
    </StyleProvider>
  </Provider>
);
