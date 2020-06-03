import React, { Component } from "react";
import { View, StyleSheet, Linking } from "react-native";

import { Container, Content, Text, H3, Spinner } from "native-base";

import { connect } from "react-redux";

import BitcoinTrans from "../util/bitcoin_trans";

const styles = StyleSheet.create({
  title: { textAlign: "center", color: "#1565c0" },
  currencyView: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});

class TransactionResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: "sending",
      transactionId: "",
      errormsg: "",
    };
  }

  componentDidMount() {
    const {
      currency,
      destinationAddress,
      publicKey,
      sendAmount,
      computedPrivateKey,
      fee,
    } = this.props;
    console.log(
      currency,
      destinationAddress,
      publicKey,
      sendAmount,
      computedPrivateKey,
      fee
    );

    if (currency === "btc") {
      BitcoinTrans.sendBitcoin(
        sendAmount,
        destinationAddress,
        publicKey,
        computedPrivateKey,
        fee
      )
        .then(tx => {
          console.log(`success ${tx}`);
          this.setState({
            transactionId: tx,
            step: "success",
          });
        })
        .catch(errorobj => {
          console.log("error");
          console.log(`error ${errorobj.errormsg}`);
          this.setState({
            errormsg: errorobj.errormsg,
            step: "error",
          });
        });
    }
    /*
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
    } */
  }

  render() {
    const {
      currency,
      destinationAddress,
      publicKey,
      sendAmount,
      fee,
    } = this.props;

    const { step, transactionId, errormsg } = this.state;
    let transactionUrl;
    if (currency === "btc") {
      transactionUrl = "https://live.blockcypher.com/btc/tx/";
    }

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          <H3 style={[styles.title]}>Transaction</H3>
          {step === "sending" && (
            <View>
              <Spinner color="#d81e5b" />
              <Text style={[styles.centerText, styles.mt16]}>Sending from</Text>
              <Text style={[styles.publicKey]}>{publicKey}</Text>
              <Text>to</Text>
              <Text style={[styles.destinationAddress]}>
                {destinationAddress}
              </Text>
              <Text>
                {sendAmount} {currency.toUpperCase()}
                {"\n"}
                with the following fees: {fee} {currency.toUpperCase()}
                {"\n"}
                This might take a while.
              </Text>
            </View>
          )}
          {step === "success" && (
            <View>
              <Text style={[styles.currencyView]}>Successfull transaction</Text>
              <Text
                style={{ color: "blue" }}
                onPress={() => Linking.openURL(transactionUrl + transactionId)}
              >
                {transactionId}
              </Text>
            </View>
          )}
          {step === "error" && (
            <View>
              <Text style={[styles.currencyView]}>
                Error during the transaction {"\n"}
                {errormsg}
              </Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default connect(state => ({
  currency: state.inputs.currency,
  publicKey: state.inputs.publicKey,
  computedPrivateKey: state.inputs.computedPrivateKey,
  destinationAddress: state.inputs.destinationAddress,
  fee: state.inputs.fee,
  sendAmount: state.inputs.sendAmount,
}))(TransactionResultScreen);
