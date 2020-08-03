import React, { Component } from "react";
import { StyleSheet, View, Linking } from "react-native";

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
  centerText: {
    textAlign: "center",
  },
  mt16: {
    marginTop: 16,
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

    let screenHistoryURL;
    if (currency === "btc") {
      screenHistoryURL = Bitcoin.historyURL + providedPublicKey;
    }
    if (currency === "ltc") {
      screenHistoryURL = Litecoin.historyURL + providedPublicKey;
    }
    if (currency === "bch") {
      screenHistoryURL = BitcoinCash.historyURL + providedPublicKey;
    }
    if (currency === "xtz") {
      screenHistoryURL = Tezos.historyURL + providedPublicKey;
    }
    if (currency === "eth") {
      screenHistoryURL = Ethereum.historyURL + providedPublicKey;
    }

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          <H3 style={[styles.title]}>Address</H3>
          <Text style={[styles.publicKey]}>{providedPublicKey}</Text>
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
            <View>
              <Text style={[styles.currencyView]}>
                {balanceAmount}{" "}
                {balanceAmountUnconfirmed !== 0 && (
                  <Text>({balanceAmountUnconfirmed} unconfirmed) </Text>
                )}{" "}
                {currency.toUpperCase()}
              </Text>
              <H3 style={[styles.title]}>History</H3>
              <Text
                style={[styles.currencyView, { color: "blue" }]}
                onPress={() => Linking.openURL(screenHistoryURL)}
              >
                Check History
              </Text>
            </View>
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
