import React, { Component } from "react";
import { Image, View } from "react-native";
import { Container, Content, Button, Text, Picker, H3 } from "native-base";

import { connect } from "react-redux";
import {
  resetKeysAction,
  updateCurrencyAction
} from "../redux/reducers/inputs";

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
          <H3 style={{ textAlign: "center", color: "#1565c0", marginTop: 32 }}>
            1. SELECT CURRENCY
          </H3>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16
            }}
          >
            <Picker
              mode="dropdown"
              selectedValue={currency}
              onValueChange={updateCurrency}
              style={{ height: 40, width: 200 }}
            >
              <Picker.Item label="Bitcoin BTC" value="btc" />
              <Picker.Item label="Ethereum ETH" value="eth" />
            </Picker>
          </View>
          <H3 style={{ textAlign: "center", color: "#1565c0", marginTop: 48 }}>
            2. SELECT DEVICE
          </H3>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16
            }}
          >
            <Button
              transparent
              onPress={() => navigation.navigate("CardFrontInput")}
              style={{
                flexDirection: "column",
                alignItems: "center",
                height: buttonImageHeight + 40
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  height: buttonImageHeight
                }}
              >
                <Image source={require("../assets/card.png")} />
              </View>
              <Text style={{ padding: 8, color: "#2c363f" }}>Card</Text>
            </Button>
            <Button
              onPress={() => navigation.navigate("BarInput")}
              transparent
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginLeft: buttonGutter,
                height: buttonImageHeight + 40
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  height: buttonImageHeight
                }}
              >
                <Image source={require("../assets/bar.png")} />
              </View>
              <Text style={{ padding: 8, color: "#2c363f" }}>Bar</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    updateCurrency: currency => {
      dispatch(updateCurrencyAction(currency));
    }
  })
)(SelectionScreen);
