import React, { Fragment } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { StyleProvider } from "native-base";
import color from "color";

import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";

import createStore from "./redux";
import StackNavigator from "./navigation/router";

const store = createStore();

export default () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(material)}>
      <Fragment>
        <StatusBar
          barStyle="light-content"
          backgroundColor={color("#1565c0")
            .darken(0.2)
            .hex()}
        />
        <StackNavigator />
      </Fragment>
    </StyleProvider>
  </Provider>
);
