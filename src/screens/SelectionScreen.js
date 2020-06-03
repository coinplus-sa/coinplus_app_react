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
} from "native-base";

import { connect } from "react-redux";
import {
  resetKeysAction,
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

class SelectionScreen extends Component {
  componentDidUpdate() {
    const { resetKeys } = this.props;
    resetKeys();
  }

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
          <H3 style={[styles.title]}>1. SELECT CRYPTO</H3>
          <View style={styles.currencyView}>
            <Item picker style={styles.picker}>
              <Picker
                mode="dropdown"
                iosHeader="Select crypto"
                iosIcon={<Icon name="ios-arrow-down" />}
                selectedValue={currency}
                onValueChange={updateCurrency}
                style={styles.picker}
              >
                <Picker.Item label="Bitcoin BTC" value="btc" />
                <Picker.Item label="Bitcoin Cash BCH" value="bch" />
                <Picker.Item label="Litecoin LTC" value="ltc" />
                <Picker.Item label="Ethereum ETH" value="eth" />
                <Picker.Item label="Tezos XTZ" value="xtz" />
              </Picker>
            </Item>
          </View>
          <H3 style={[styles.title, styles.mt48]}>2. SELECT MODE</H3>
          <View style={styles.currencyView}>
            <Item picker style={styles.picker}>
              <Picker
                mode="dropdown"
                iosHeader="Select mode"
                iosIcon={<Icon name="ios-arrow-down" />}
                selectedValue={mode}
                onValueChange={updateMode}
                style={styles.picker}
              >
                <Picker.Item label="SOLO simple support" value="simple" />
                <Picker.Item label="SOLO pro 2 of 3" value="pro" />
              </Picker>
            </Item>
          </View>
          <H3 style={[styles.title, styles.mt48]}>3. SELECT FORM FACTOR</H3>
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
    mode: state.inputs.mode,
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    updateCurrency: currency => {
      dispatch(updateCurrencyAction(currency));
    },
    updateMode: mode => {
      dispatch(updateModeAction(mode));
    },
  })
)(SelectionScreen);
