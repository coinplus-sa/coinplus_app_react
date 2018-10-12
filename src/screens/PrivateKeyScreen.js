import React, { Component } from "react";
import { Image, View, InteractionManager } from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Content,
  Right,
  Button,
  Text,
  Icon,
  H3,
  Spinner
} from "native-base";
import { connect } from "react-redux";
import computePrivateKeyBitcoin from "../util/bitcoin";
import computePrivateKeyEthereum from "../util/ethereum";
import logo from "../assets/logo.png";

class PrivateKeyScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: "",
      step: "unprocessed"
    };

    this.computePrivateKey = this.computePrivateKey.bind(this);
    this.requestComputePrivateKey = this.requestComputePrivateKey.bind(this);
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

  computePrivateKey() {
    const { step } = this.state;
    if (step === "processed") return;

    InteractionManager.runAfterInteractions(async () => {
      const { key1, key2, currency } = this.props;

      if (currency === "btc") {
        const privateKey = await computePrivateKeyBitcoin(key1, key2);
        this.setState({ privateKey, step: "processed" });
      } else {
        const privateKey = await computePrivateKeyEthereum(key1, key2);
        this.setState({ privateKey, step: "processed" });
      }
    });
  }

  render() {
    const { currency } = this.props;
    const { privateKey, step } = this.state;

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          <H3 style={{ textAlign: "center", color: "#1565c0", marginTop: 32 }}>
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
                    textAlign: "center"
                  }}
                >
                  Processed {currency} private key is
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 16,
                    fontWeight: "bold",
                    color: "#d81e5b"
                  }}
                >
                  {privateKey}
                </Text>
              </View>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

PrivateKeyScreen.navigationOptions = ({ navigation }) => ({
  header: (
    <Header>
      <Left>
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body
        style={{
          minHeight: 50,
          justifyContent: "center"
        }}
      >
        <Image source={logo} />
      </Body>
      <Right />
    </Header>
  )
});

export default connect(state => ({
  key1: state.inputs.key1,
  key2: state.inputs.key2,
  currency: state.inputs.currency
}))(PrivateKeyScreen);
