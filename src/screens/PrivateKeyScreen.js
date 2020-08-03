import React, { Component } from "react";
import {
  View,
  InteractionManager,
  TouchableOpacity,
  Clipboard,
  StyleSheet,
} from "react-native";
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  H3,
  Spinner,
  Footer,
  FooterTab,
} from "native-base";
import { connect } from "react-redux";

import Bitcoin from "../util/bitcoin";
import BitcoinCash from "../util/bitcoincash";
import Litecoin from "../util/litecoin";
import Tezos from "../util/tezos";
import Ethereum from "../util/ethereum";
import { computeSoloPro } from "../util/generic";

import { updateComputedPrivateKeyAction } from "../redux/reducers/inputs";

const styles = StyleSheet.create({
  publicKey: {
    textAlign: "center",
    marginTop: 16,
    fontWeight: "bold",
    color: "#1565c0",
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

class PrivateKeyScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: "unprocessed",
    };

    this.computePrivateKey = this.computePrivateKey.bind(this);
    this.requestComputePrivateKey = this.requestComputePrivateKey.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.timer = null;
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  requestComputePrivateKey() {
    this.setState(
      {
        step: "processing",
      },
      () => {
        this.timer = setTimeout(this.computePrivateKey, 100);
      }
    );
  }

  copyToClipboard() {
    const { computedPrivateKey } = this.props;
    Clipboard.setString(computedPrivateKey);
  }

  computePrivateKey() {
    const { step } = this.state;
    if (step === "processed") return;
    console.log("start");
    InteractionManager.runAfterInteractions(async () => {
      const {
        providedKey1,
        providedKey2,
        providedDeviceId,
        providedProKey1,
        providedProKey2,
        providedProDeviceId,
        providedPublicKey,
        currency,
        mode,
        updateComputedPrivateKey,
      } = this.props;

      const s1pro = {
        s14: providedKey2,
        s28: providedKey1,
        index: providedDeviceId,
      };

      const s2pro = {
        s14: providedProKey2,
        s28: providedProKey1,
        index: providedProDeviceId,
      };
      let secret1;
      let secret2;
      if (mode === "pro") {
        ({ secret1, secret2 } = await computeSoloPro({
          s1pro,
          s2pro,
          currency,
        }));
      } else {
        secret1 = providedKey1;
        secret2 = providedKey2;
      }

      let computedPrivateKey = "";
      if (currency === "btc") {
        let wif = "";
        wif = await Bitcoin.getWifBTC(secret1, secret2);
        const computedPublicKey = Bitcoin.getPublicKeyFromWif(wif);
        console.log("wif", wif);

        if (providedPublicKey !== computedPublicKey) {
          this.setState({ step: "mismatch" });
        } else {
          computedPrivateKey = wif;
          this.setState({
            step: "processed",
          });
        }
      } else if (currency === "bch") {
        let wif = "";
        wif = await BitcoinCash.getWifBCH(secret1, secret2);

        const computedPublicKey = BitcoinCash.getPublicKeyFromWif(wif);
        let providedPublicKeyWithoutColon;
        let computedPublicKeyWithoutColon;
        if (providedPublicKey.split(":") > 1) {
          [, providedPublicKeyWithoutColon] = providedPublicKey.split(":");
        } else {
          providedPublicKeyWithoutColon = providedPublicKey;
        }
        if (computedPublicKey.split(":") > 1) {
          [, computedPublicKeyWithoutColon] = computedPublicKey.split(":");
        } else {
          computedPublicKeyWithoutColon = computedPublicKey;
        }
        if (providedPublicKeyWithoutColon !== computedPublicKeyWithoutColon) {
          this.setState({ step: "mismatch" });
        } else {
          computedPrivateKey = wif;
          this.setState({
            step: "processed",
          });
        }
      } else if (currency === "ltc") {
        let wif = "";
        wif = await Litecoin.getWifLTC(secret1, secret2);

        const computedPublicKey = Litecoin.getPublicKeyFromWif(wif);

        if (providedPublicKey !== computedPublicKey) {
          this.setState({ step: "mismatch" });
        } else {
          computedPrivateKey = wif;
          this.setState({
            step: "processed",
          });
        }
      } else if (currency === "xtz") {
        const { bitcoin: bitcoinTz, tezos: tezosTz } = await Tezos.getWifXTZ(
          secret1,
          secret2
        );

        const computedPublicKey = Tezos.getPublicKeyFromWif(bitcoinTz);

        if (providedPublicKey !== computedPublicKey) {
          this.setState({ step: "mismatch" });
        } else {
          computedPrivateKey = tezosTz;
          this.setState({
            step: "processed",
          });
        }
      } else {
        computedPrivateKey = await Ethereum.getPrivateKey(secret1, secret2);

        const keysMatch = Ethereum.isPublicAddressDerivedFromPrivateKey(
          providedPublicKey,
          computedPrivateKey
        );

        if (!keysMatch) {
          this.setState({ step: "mismatch" });
        } else {
          this.setState({
            step: "processed",
          });
        }
      }
      console.log("computePrivateKey ", computedPrivateKey);
      updateComputedPrivateKey(computedPrivateKey);
    });
  }

  render() {
    const {
      providedPublicKey,
      navigation,
      computedPrivateKey,
      currency,
    } = this.props;
    const { step } = this.state;

    return (
      <Container>
        {step === "mismatch" ? (
          <Content padder contentContainerStyle={{ flexGrow: 1 }}>
            <H3 style={[styles.centerText, styles.colorPrimary, styles.mt32]}>
              ERROR
            </H3>
            <Text style={[styles.centerText, styles.mt16]}>
              The provided secret keys 1 and 2 do not match with your public
              address
            </Text>
            <Text style={styles.publicKey}>{providedPublicKey}</Text>
            <View style={styles.mainView}>
              <View>
                <Button
                  style={styles.button}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="arrow-back" style={styles.iconSize} />
                </Button>
                <H3
                  style={[
                    styles.centerText,
                    styles.colorSecondary,
                    styles.mt16,
                  ]}
                >
                  TRY AGAIN
                </H3>
              </View>
            </View>
          </Content>
        ) : (
          <Content padder contentContainerStyle={{ flexGrow: 1 }}>
            <H3 style={[styles.centerText, styles.colorPrimary, styles.mt32]}>
              WARNING
            </H3>
            <Text style={[styles.centerText, styles.mt16]}>
              Your private key is your password.
              {"\n"}
              Keep it strictly confidential.
            </Text>
            <View style={styles.mainView}>
              {step === "unprocessed" && (
                <View>
                  <Button
                    style={styles.button}
                    onLongPress={this.requestComputePrivateKey}
                    delayLongPress={1000}
                  >
                    <Icon name="lock" style={styles.iconSize} />
                  </Button>
                  <H3
                    style={[
                      styles.centerText,
                      styles.colorSecondary,
                      styles.mt16,
                    ]}
                  >
                    PRESS & HOLD
                  </H3>
                  <Text style={[styles.centerText, styles.mt8]}>
                    To display your private key
                  </Text>
                </View>
              )}
              {step === "processing" && (
                <View>
                  <Spinner color="#d81e5b" />
                  <Text style={[styles.centerText, styles.mt16]}>
                    Processing...
                    {"\n"}
                    This might take a while.
                  </Text>
                </View>
              )}
              {step === "processed" && (
                <View>
                  <Text
                    style={[
                      styles.bold,
                      styles.centerText,
                      styles.colorPrimary,
                    ]}
                  >
                    {providedPublicKey}
                  </Text>
                  <Text style={[styles.centerText, styles.mt16]}>
                    processed private key is
                  </Text>
                  <TouchableOpacity
                    onPress={this.copyToClipboard}
                    style={styles.touchable}
                  >
                    <Text
                      style={[
                        styles.bold,
                        styles.centerText,
                        styles.colorSecondary,
                      ]}
                    >
                      {computedPrivateKey}
                    </Text>
                    <Text
                      style={[
                        styles.bold,
                        styles.centerText,
                        styles.colorSecondary,
                        styles.mt16,
                      ]}
                    >
                      COPY TO CLIPBOARD
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Content>
        )}
        {step === "processed" && (
          <Footer style={styles.transparentBackground}>
            <FooterTab>
              <Button
                primary
                full
                onPress={() => {
                  navigation.navigate("Transaction");
                }}
              >
                <Text style={styles.colorWhite}>Create Transaction</Text>
              </Button>
            </FooterTab>
          </Footer>
        )}
      </Container>
    );
  }
}

export default connect(
  state => ({
    providedKey1: state.inputs.key1,
    providedKey2: state.inputs.key2,
    providedDeviceId: state.inputs.deviceId,
    providedProKey1: state.inputs.proKey1,
    providedProKey2: state.inputs.proKey2,
    providedProDeviceId: state.inputs.proDeviceId,
    providedPublicKey: state.inputs.publicKey,
    computedPrivateKey: state.inputs.computedPrivateKey,
    currency: state.inputs.currency,
    mode: state.inputs.mode,
  }),
  dispatch => ({
    updateComputedPrivateKey: computedPrivateKey => {
      dispatch(updateComputedPrivateKeyAction(computedPrivateKey));
    },
  })
)(PrivateKeyScreen);
