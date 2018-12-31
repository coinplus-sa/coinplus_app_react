import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Container, Content, Button, Text, Picker, H3 } from "native-base";

import { connect } from "react-redux";
import {
  resetKeysAction,
  updateCurrencyAction,
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
  picker: { height: 40, width: 200 },
  button: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonLabel: {
    padding: 8,
    color: "#2c363f",
  },
  mt32: {
    marginTop: 32,
  },
  mt48: {
    marginTop: 48,
  },
});

class SelectionScreen extends Component {
  componentDidUpdate() {
    const { resetKeys } = this.props;
    resetKeys();
  }

  render() {
    const { navigation, currency, updateCurrency } = this.props;

    const buttonImageHeight = 80;
    const buttonGutter = 48;

    return (
      <Container>
        <Content padder>
          <H3 style={[styles.title, styles.mt32]}>1. SELECT CURRENCY</H3>
          <View style={styles.currencyView}>
            <Picker
              mode="dropdown"
              selectedValue={currency}
              onValueChange={updateCurrency}
              style={styles.picker}
            >
              <Picker.Item label="Bitcoin BTC" value="btc" />
              <Picker.Item label="Ethereum ETH" value="eth" />
            </Picker>
          </View>
          <H3 style={[styles.title, styles.mt48]}>2. SELECT DEVICE</H3>
          <View style={styles.deviceView}>
            <Button
              transparent
              onPress={() => navigation.navigate("CardFrontInput")}
              style={[
                styles.button,
                {
                  height: buttonImageHeight + 40,
                },
              ]}
            >
              <View
                style={{
                  justifyContent: "center",
                  height: buttonImageHeight,
                }}
              >
                <Image source={require("../assets/card.png")} />
              </View>
              <Text style={styles.buttonLabel}>Card</Text>
            </Button>
            <Button
              onPress={() => navigation.navigate("BarInput")}
              transparent
              style={[
                styles.button,
                {
                  marginLeft: buttonGutter,
                  height: buttonImageHeight + 40,
                },
              ]}
            >
              <View
                style={{
                  justifyContent: "center",
                  height: buttonImageHeight,
                }}
              >
                <Image source={require("../assets/bar.png")} />
              </View>
              <Text style={styles.buttonLabel}>Bar</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency,
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    updateCurrency: currency => {
      dispatch(updateCurrencyAction(currency));
    },
  })
)(SelectionScreen);
