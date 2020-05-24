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

class TransactionScreen extends Component {
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
          <H3 style={[styles.title]}>Balance Available</H3>

          <H3 style={[styles.title]}>Destination Address</H3>
          <Input
            placeholder="Address"
            onChangeText={updateDestinationAddress}
            autoCapitalize="none"
            autoCorrect={false}
            value={destinationAddress}
            style={styles.textInput}
          />
          <Icon
            active
            name="md-qr-scanner"
            onPress={() => {
              Keyboard.dismiss();
              navigation.navigate("QRScan");
            }}
          />
          <H3 style={[styles.title]}>Fees</H3>
          <Input
            placeholder="Public key"
            onChangeText={updateFee}
            autoCapitalize="none"
            autoCorrect={false}
            value={fee}
            style={styles.textInput}
          />
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency,
    mode: state.inputs.mode,
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    updateCurrency: currency => {
      dispatch(updateCurrencyAction(currency));
    },
    updateMode: currency => {
      dispatch(updateModeAction(currency));
    },
  })
)(TransactionScreen);
