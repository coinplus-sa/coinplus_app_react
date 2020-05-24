import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { Container, Content, Text, H3, Spinner } from "native-base";
import { connect } from "react-redux";
import Bitcoin from "../util/bitcoin";
import BitcoinCash from "../util/bitcoincash";
import Litecoin from "../util/litecoin";
import Tezos from "../util/tezos";
import Ethereum from "../util/ethereum";

const styles = StyleSheet.create({
  title: { textAlign: "center", color: "#1565c0", marginTop: 16 },
  currencyView: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
    backgroundColor: "#fff",
    padding: 16,
  },
  publicKey: {
    textAlign: "center",
    marginTop: 16,
    fontWeight: "bold",
    color: "#1565c0",
    marginBottom: 32,
  },
  mainView: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  touchable: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  colorPrimary: {
    color: "#1565c0",
  },
  colorSecondary: {
    color: "#d81e5b",
  },
  iconSize: {
    fontSize: 48,
  },
  centerText: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
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
  mt8: {
    marginTop: 8,
  },
  mt16: {
    marginTop: 16,
  },
  mt32: {
    marginTop: 32,
  },
});

class BalanceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      balanceAmountUnconfirmed: 0,
      balanceAmount: 0,
      step: "fetching",
    };
  }

  componentDidMount() {
    const { currency, providedPublicKey } = this.props;

    if (currency === "btc") {
      Bitcoin.getBalance(providedPublicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "ltc") {
      Litecoin.getBalance(providedPublicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "bch") {
      BitcoinCash.getBalance(providedPublicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "xtz") {
      Tezos.getBalance(providedPublicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "eth") {
      Ethereum.getBalance(providedPublicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
  }

  render() {
    const { providedPublicKey, currency } = this.props;
    const { balanceAmount, balanceAmountUnconfirmed, step } = this.state;

    const buttonImageHeight = 80;
    const buttonGutter = 48;

    return (
      <Container>
        <Content
          padder
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <H3 style={[styles.title]}>Address</H3>
          <Text style={[styles.publicKey]} >{providedPublicKey}</Text>
          <H3 style={[styles.title]}>Balance Available</H3>
          {step === "fetching" ? (
            <View>
              <Spinner color="#d81e5b" />
              <Text style={[styles.centerText, styles.mt16]}>
                Fetching...
                {"\n"}
                This might take a while.
              </Text>
            </View>
          ) : (
            <Text style={[styles.currencyView]}>
              {balanceAmount}{" "}
              {balanceAmountUnconfirmed !== 0 && (
                <Text>({balanceAmountUnconfirmed} unconfirmed) </Text>
              )}{" "}
              {currency.toUpperCase()}
            </Text>
          )}
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency,
    providedPublicKey: state.inputs.publicKey,
  })
  /*
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
  }) */
)(BalanceScreen);
