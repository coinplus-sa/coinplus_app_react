import React, { Component } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import {
  Container,
  Content,
  Button,
  Text,
  H3,
  Item,
  Icon,
  Input,
  Spinner,
  Footer,
  FooterTab,
  Switch,
} from "native-base";

import { connect } from "react-redux";
import { Decimal } from "decimal.js";
import Bitcoin from "../util/bitcoin";
import BitcoinTrans from "../util/bitcoin_trans";
import BitcoinCashTrans from "../util/bitcoincash_trans";

import EthereumTrans from "../util/ethereum_trans";

import BitcoinCash from "../util/bitcoincash";
import Litecoin from "../util/litecoin";
import Tezos from "../util/tezos";
import TezosTrans from "../util/tezos_trans"
import Ethereum from "../util/ethereum";

import { isValidAddress } from "../util/generic";
import {
  updateCurrencyAction,
  updateDestinationAddressAction,
  updateComputedPrivateKeyAction,
  updateSendAmountAction,
  updateFeeAction,
} from "../redux/reducers/inputs";

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: "#1565c0",
    marginTop: 8,
    marginBottom: 16,
  },
  currencyView: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  publicKey: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#1565c0",
    marginBottom: 16,
  },
  switchItem: {
    textAlign: "right",
    margin: 8,
  },
  item: {
    backgroundColor: "#fff",
  },
});

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceAmountUnconfirmed: 0,
      balanceAmount: "0",
      step: "fetching",
      fullAmountLock: false,
    };
    this.fullAmount = this.fullAmount.bind(this);
    this.fullAmountState = this.fullAmountState.bind(this);
    this.resetFees = this.resetFees.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);
    this.updateFeeAndAmount = this.updateFeeAndAmount.bind(this);
    this.updateSendAmountAndUnlock = this.updateSendAmountAndUnlock.bind(this);
    this.updateDestinationAddressAndFee = this.updateDestinationAddressAndFee.bind(this);
  }

  async componentDidMount() {
    await this.resetFees();
    this.refreshBalance();
  }

  async resetFees(destinationAddress) {
    const { currency, publicKey, computedPrivateKey } = this.props;
  
    if (currency === "btc" || currency === "ltc" ) {
      BitcoinTrans.getFees(publicKey, currency)
        .then(res => {
          this.updateFeeAndAmount(Decimal(res).toString());
        })
        .catch(err => {
          alert(err);
        });
    }
    if (currency === "bch" ) {
      BitcoinCashTrans.getFees("0", publicKey, publicKey, computedPrivateKey)
        .then(res => {
          this.updateFeeAndAmount(Decimal(res).toString());
        })
        .catch(err => {
          alert(err);
        });
    }
    if (currency === "xtz" ) {
      try{
      let res = await TezosTrans.getFees(destinationAddress)
      this.updateFeeAndAmount(Decimal(res).toString());
      }
        
      catch(err ){
          alert(err);
        };
    }
    if (currency === "eth" ) {
      EthereumTrans.getFees(publicKey, currency)
        .then(res => {
          this.updateFeeAndAmount(Decimal(res).toString());
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  refreshBalance() {
    const { currency, publicKey } = this.props;
    if (currency === "btc") {
      Bitcoin.getBalance(publicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "ltc") {
      Litecoin.getBalance(publicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "bch") {
      BitcoinCash.getBalance(publicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "xtz") {
      Tezos.getBalance(publicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
    if (currency === "eth") {
      Ethereum.getBalance(publicKey).then(balance => {
        this.setState({
          balanceAmount: balance.finalBalance,
          balanceAmountUnconfirmed: balance.unconfirmedBalance,
          step: "display",
        });
      });
    }
  }

  fullAmount() {
    const { balanceAmount } = this.state;
    const { fee, updateSendAmount } = this.props;
    try {
      updateSendAmount(
        Decimal(balanceAmount)
          .sub(Decimal(fee))
          .toString()
      );
    } catch {
      // keep the value entered by the user
    }
  }

  fullAmountState() {
    const { fullAmountLock } = this.state;
    if (fullAmountLock === false) {
      this.fullAmount();
    }
    this.setState({
      fullAmountLock: !fullAmountLock,
    });
  }

  updateFeeAndAmount(value) {
    const { updateSendAmount, updateFee } = this.props;
    const { fullAmountLock, balanceAmount } = this.state;
    updateFee(value);
    if (fullAmountLock === true) {
      try {
        if (Decimal(balanceAmount).sub(Decimal(value)) < 0) {
          updateSendAmount("0");
        } else {
          updateSendAmount(
            Decimal(balanceAmount)
              .sub(Decimal(value))
              .toString()
          );
        }
      } catch {
        // keep the value entered by the user
      }
    }
    this.setState({});
  }
  updateDestinationAddressAndFee(addr){
    const {
      updateDestinationAddress,
      currency
    } = this.props;
    updateDestinationAddress(addr)
    if (currency === "xtz"){
      this.resetFees(addr)
    }
  }

  updateSendAmountAndUnlock(value) {
    const { updateSendAmount } = this.props;

    this.setState({
      fullAmountLock: false,
    });
    updateSendAmount(value);
  }

  render() {
    const {
      navigation,
      currency,
      destinationAddress,
      publicKey,
      sendAmount,
      fee,
    } = this.props;

    const {
      balanceAmount,
      balanceAmountUnconfirmed,
      step,
      fullAmountLock
    } = this.state;
    let isValid = true;
    if (!isValidAddress(publicKey, currency)) {
      isValid = false;
    }
    try {
      isValid =
        Decimal(balanceAmount)
          .sub(Decimal(fee))
          .comparedTo(Decimal(sendAmount)) >= 0;
      isValid = isValid && Decimal(sendAmount) > 0;
      isValid = isValid && Decimal(fee) >= 0;
    } catch {
      isValid = false;
    }

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          <H3 style={[styles.title]}>Address</H3>
          <Text
            style={[styles.publicKey]}
            onPress={() => {
              this.refreshBalance();
            }}
          >
            {publicKey}
          </Text>
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
              Balance Available:{"\n"}
              {balanceAmount}{" "}
              {balanceAmountUnconfirmed !== 0 && (
                <Text>({balanceAmountUnconfirmed} unconfirmed) </Text>
              )}{" "}
              {currency.toUpperCase()}
            </Text>
          )}
          <H3 style={[styles.title]}>Destination Address</H3>
          <Item regular success={isValid} style={[styles.item]}>
            <Input
              placeholder="Address"
              onChangeText={this.updateDestinationAddressAndFee}
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
                navigation.navigate("QRScan", { qrtype: "destination" , callback: this.updateDestinationAddressAndFee});
              }}
            />
          </Item>
          <H3 style={[styles.title]}>Amount</H3>
          <Item regular success={isValid} style={[styles.item]}>
            <Input
              placeholder="Amount to Send"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.updateSendAmountAndUnlock}
              value={sendAmount}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </Item>
          <View
            style={[
              styles.switchItem,
              { flexDirection: "row", justifyContent: "flex-end" },
            ]}
          >
            <Text>All</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={fullAmountLock ? "#ff0000" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.fullAmountState}
              value={fullAmountLock}
            />
          </View>
          <H3 style={[styles.title]}>Fees</H3>
          <Item regular success={isValid} style={[styles.item]}>
            <Input
              placeholder="Fees"
              onChangeText={this.updateFeeAndAmount}
              autoCapitalize="none"
              autoCorrect={false}
              value={fee}
              keyboardType="numeric"
              style={styles.textInput}
            />
            <Icon
              active
              name="md-refresh-circle"
              onPress={() => {
                this.resetFees();
              }}
            />
          </Item>
        </Content>
        <Footer style={styles.transparentBackground}>
          <FooterTab>
            <Button
              primary
              full
              disabled={!isValid}
              onPress={() => {
                navigation.navigate("TransactionResult");
              }}
            >
              <Text style={styles.colorWhite}>Send</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(
  state => ({
    currency: state.inputs.currency,
    publicKey: state.inputs.publicKey,
    computedPrivateKey: state.inputs.computedPrivateKey,
    destinationAddress: state.inputs.destinationAddress,
    fee: state.inputs.fee,
    sendAmount: state.inputs.sendAmount,
  }),
  dispatch => ({
    updateDestinationAddress: addr => {
      dispatch(updateDestinationAddressAction(addr));
    },
    updateCurrency: currency => {
      dispatch(updateCurrencyAction(currency));
    },
    updateComputedPrivateKey: key => {
      dispatch(updateComputedPrivateKeyAction(key));
    },
    updateFee: fee => {
      dispatch(updateFeeAction(fee));
    },
    updateSendAmount: sendAmount => {
      dispatch(updateSendAmountAction(sendAmount));
    },
  })
)(TransactionScreen);
