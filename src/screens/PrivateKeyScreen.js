import React, { Component } from "react";
import {
  View,
  InteractionManager,
  TouchableOpacity,
  Clipboard
} from "react-native";
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  H3,
  Spinner
} from "native-base";
import { connect } from "react-redux";

import Bitcoin from "../util/bitcoin";
import Ethereum from "../util/ethereum";

class PrivateKeyScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      computedPrivateKey: "",
      step: "unprocessed"
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
        step: "processing"
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
        currency
      } = this.props;

      if (currency === "btc") {
        const wif = await Bitcoin.getWIF(providedKey1, providedKey2);
        const computedPublicKey = Bitcoin.getPublicKeyFromWif(wif);

        if (providedPublicKey !== computedPublicKey) {
          this.setState({ step: "mismatch" });
        } else {
          this.setState({
            computedPrivateKey: wif,
            step: "processed"
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
            step: "processed"
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
          <Content contentContainerStyle={{ flexGrow: 1 }}>
            <H3
              style={{ textAlign: "center", color: "#1565c0", marginTop: 32 }}
            >
              ERROR
            </H3>
            <Text style={{ textAlign: "center", marginTop: 16 }}>
              The provided secret keys 1 and 2 do not match with your public
              address
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 16,
                fontWeight: "bold",
                color: "#1565c0"
              }}
            >
              {providedPublicKey}
            </Text>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 40
              }}
            >
              <View>
                <Button
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    borderRadius: 40,
                    height: 80,
                    width: 80
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="arrow-back" style={{ fontSize: 48 }} />
                </Button>
                <H3
                  style={{
                    textAlign: "center",
                    color: "#d81e5b",
                    marginTop: 16
                  }}
                >
                  TRY AGAIN
                </H3>
              </View>
            </View>
          </Content>
        ) : (
          <Content contentContainerStyle={{ flexGrow: 1 }}>
            <H3
              style={{ textAlign: "center", color: "#1565c0", marginTop: 32 }}
            >
              WARNING
            </H3>
            <Text style={{ textAlign: "center", marginTop: 16 }}>
              Your private key is your password.
              {"\n"}
              Keep it strictly confidential.
            </Text>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 40
              }}
            >
              {step === "unprocessed" && (
                <View>
                  <Button
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                      borderRadius: 40,
                      height: 80,
                      width: 80
                    }}
                    onLongPress={this.requestComputePrivateKey}
                    delayLongPress={1000}
                  >
                    <Icon name="lock" style={{ fontSize: 48 }} />
                  </Button>
                  <H3
                    style={{
                      textAlign: "center",
                      color: "#d81e5b",
                      marginTop: 16
                    }}
                  >
                    PRESS & HOLD
                  </H3>
                  <Text style={{ textAlign: "center", marginTop: 8 }}>
                    To display your private key
                  </Text>
                </View>
              )}
              {step === "processing" && (
                <View>
                  <Spinner color="#d81e5b" />
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 16
                    }}
                  >
                    Processing...
                    {"\n"}
                    This might take a while.
                  </Text>
                </View>
              )}
              {step === "processed" && (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1565c0"
                    }}
                  >
                    {providedPublicKey}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 16
                    }}
                  >
                    processed private key is
                  </Text>
                  <TouchableOpacity
                    onPress={this.copyToClipboard}
                    style={{
                      backgroundColor: "#fff",
                      marginTop: 8,
                      padding: 16
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#d81e5b"
                      }}
                    >
                      {computedPrivateKey}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 16,
                        fontWeight: "bold",
                        color: "#d81e5b"
                      }}
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
  currency: state.inputs.currency
}))(PrivateKeyScreen);
