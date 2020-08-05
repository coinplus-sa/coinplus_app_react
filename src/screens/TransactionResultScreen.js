import React, { Component } from "react";
import { View, StyleSheet, Linking } from "react-native";

import { Container, Content, Text, H3, Spinner } from "native-base";

import { connect } from "react-redux";

import BitcoinTrans from "../util/bitcoin_trans";
import BitcoinCashTrans from "../util/bitcoincash_trans";
import TezosTrans from "../util/tezos_trans"

import EthereumTrans from "../util/ethereum_trans";

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: "#1565c0",
    marginTop: 8,
    marginBottom: 16,
  },
  publicKey: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#1565c0",
    marginBottom: 16,
  },
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

  async componentDidMount() {
    const {
      currency,
      destinationAddress,
      publicKey,
      sendAmount,
      computedPrivateKey,
      fee,
    } = this.props;

    if (currency === "btc" || currency === "ltc") {
      BitcoinTrans.sendBitcoin(
        sendAmount,
        destinationAddress,
        publicKey,
        computedPrivateKey,
        fee, currency
      )
        .then(tx => {
          console.log(`success ${tx}`);
          this.setState({
            transactionId: tx,
            step: "success",
          });
        })
        .catch(error => {
          console.log(`error ${error}`);
          this.setState({
            errormsg: "" + error,
            step: "error",
          });
        });
    }
    if (currency === "bch") {
      BitcoinCashTrans.sendBitcoinCash(
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
        .catch(error => {
          console.log("error",error);
          this.setState({
            errormsg: "" + error,
            step: "error",
          });
        });
    }
    if (currency === "xtz") {
      try{
        let tx = await TezosTrans.sendTezos(
          sendAmount,
          destinationAddress,
          publicKey,
          computedPrivateKey,
          fee
        )
        console.log(`success ${tx}`);
        this.setState({
            transactionId: tx,
            step: "success",
          });
        }
      catch (error){
          console.log(`error ${error}`);
          this.setState({
            errormsg: "" + error,
            step: "error",
          });
        };
    }    
    if (currency === "eth") {
      EthereumTrans.sendEther(
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
        .catch(error => {
          console.log(`error ${error}`);
          this.setState({
            errormsg: "" + error,
            step: "error",
          });
        });
    }
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
    if (currency === "ltc") {
      transactionUrl = "https://live.blockcypher.com/ltc/tx/";
    }
    if (currency === "eth") {
      transactionUrl = "https://etherscan.io/tx/";
    }
    if (currency === "bch") {
      transactionUrl = "https://explorer.bitcoin.com/bch/tx/";
    }
    if (currency === "xtz") {
      transactionUrl = "https://tzkt.io/";
    }

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          <H3 style={[styles.title]}>Transaction</H3>
            {step === "sending" && (

            <View>

              <H3 style={[styles.title]}>Sending from</H3>
              <Text style={[styles.publicKey]}>{publicKey}</Text>
              <H3 style={[styles.title]}>Destination Address</H3>
              <Text style={[styles.destinationAddress]}>
                {destinationAddress}
              </Text>
              <H3 style={[styles.title]}>Amount</H3>
              <Text>
                {sendAmount} {currency.toUpperCase()}
              </Text>
              <H3 style={[styles.title]}>Fees (might be approximative)</H3>
              <Text>
                {fee} {currency.toUpperCase()}
              </Text>
              <Text>
                This might take a while.
              </Text>
              <Spinner color="#d81e5b" /> 
              </View>
              )}
              {step === "success" && (
                            <View>
              <H3 style={[styles.title]}>Sending from</H3>
              <Text style={[styles.publicKey]}>{publicKey}</Text>
              <H3 style={[styles.title]}>Destination Address</H3>
              <Text style={[styles.destinationAddress]}>
                {destinationAddress}
              </Text>
              <H3 style={[styles.title]}>Amount</H3>
              <Text>
                {sendAmount} {currency.toUpperCase()}
              </Text>
              <H3 style={[styles.title]}>Fees (might be approximative)</H3>
              <Text>
                {fee} {currency.toUpperCase()}
              </Text>
              <H3 style={[styles.title]}>Successfull transaction</H3>
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
