import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";

import {
  Container,
  Content,
  Button,
  Text,
  Picker,
  H3,
  Item,
  Icon,
  Input,
} from "native-base";

import { connect } from "react-redux";
import {
  updateCurrencyAction,
  updateModeAction,
} from "../redux/reducers/inputs";

const styles = StyleSheet.create({
  title: { textAlign: "center", color: "#1565c0" },
  currencyView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  deviceView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  picker: {
    height: 40,
    width: 240,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonLabel: {
    padding: 8,
    color: "#2c363f",
  },
  mt48: {
    marginTop: 48,
  },
});

class TransactionResultScreen extends Component {
  componentDidUpdate() {}

  render() {
    const {
      navigation,
      currency,
      mode,
      updateCurrency,
      updateMode,
    } = this.props;

    const buttonImageHeight = 80;
    const buttonGutter = 48;

    return (
      <Container>
        <Content
          padder
          contentContainerStyle={{ justifyContent: "center", flex: 1 }}
        >
          <H3 style={[styles.title]}>Transaction</H3>
          <Text>{transaction}</Text>
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency,
    mode: state.inputs.mode,
  })
  /*
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
  }) */
)(TransactionResultScreen);
