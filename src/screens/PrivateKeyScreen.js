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
} from "native-base";
import { connect } from "react-redux";

import Bitcoin from "../util/bitcoin";
import Ethereum from "../util/ethereum";

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
      computedPrivateKey: "",
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
    const { computedPrivateKey } = this.state;
    Clipboard.setString(computedPrivateKey);
  }

  computePrivateKey() {
    const { step } = this.state;
    if (step === "processed") return;

    InteractionManager.runAfterInteractions(async () => {
      const {
        providedKey1,
        providedKey2,
        providedPublicKey,
        currency,
      } = this.props;

      if (currency === "btc") {
        const wif = await Bitcoin.getWIF(providedKey1, providedKey2);
        const computedPublicKey = Bitcoin.getPublicKeyFromWif(wif);

        if (providedPublicKey !== computedPublicKey) {
          this.setState({ step: "mismatch" });
        } else {
          this.setState({
            computedPrivateKey: wif,
            step: "processed",
          });
        }
      } else {
        const computedPrivateKey = await Ethereum.getPrivateKey(
          providedKey1,
          providedKey2
        );
        const addressKey = Ethereum.getAddressKey(computedPrivateKey);

        if (providedPublicKey.toLowerCase() !== addressKey) {
          this.setState({ step: "mismatch" });
        } else {
          this.setState({
            computedPrivateKey,
            step: "processed",
          });
        }
      }
    });
  }

  render() {
    const { providedPublicKey, navigation } = this.props;
    const { computedPrivateKey, step } = this.state;

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
      </Container>
    );
  }
}

export default connect(state => ({
  providedKey1: state.inputs.key1,
  providedKey2: state.inputs.key2,
  providedPublicKey: state.inputs.publicKey,
  currency: state.inputs.currency,
}))(PrivateKeyScreen);
