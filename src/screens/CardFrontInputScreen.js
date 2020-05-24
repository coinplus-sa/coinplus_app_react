import React, { Component } from "react";
import {
  Image,
  Keyboard,
  Dimensions,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Input,
  Button,
  Text,
  Item,
  Icon,
} from "native-base";
import { connect } from "react-redux";
import NfcManager, { Ndef } from "react-native-nfc-manager";

import {
  resetPublicKeyAction,
  updatePublicKeyAction,
} from "../redux/reducers/inputs";
import parseScannedCode from "../util/scannedCodeParser";
import { isValidAddress } from "../util/generic";

const monospaceFont = Platform.OS === "android" ? "monospace" : "Menlo";

const originalWidth = 680;
const originalHeight = 434;
const ratio = originalWidth / originalHeight;

const adjust = 6;

const input1 = {
  x: 3 - adjust,
  y: 262,
  width: 677 - 3,
  height: 330 - 262,
};

const styles = StyleSheet.create({
  view: {
    alignSelf: "center",
    justifyContent: "center",
    flexGrow: 1,
    position: "relative",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  item: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  textInput: {
    fontFamily: monospaceFont,
    fontSize: 14,
    paddingVertical: 0,
    paddingLeft: 20,
    paddingRight: 20,
    textAlignVertical: "center",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  colorWhite: {
    color: "#fff",
  },
});

class CardFrontInputScreen extends Component {
  state = {
    bar: {},
    layoutComputed: false,
  };

  constructor(props) {
    super(props);
    props.resetPublicKey();
    this.stateChangedSubscription = null;
  }

  componentDidMount() {
    NfcManager.isSupported().then(supported => {
      if (supported) {
        this.startNfc();
      }
    });
  }

  componentWillUnmount() {
    if (this.stateChangedSubscription) {
      this.stateChangedSubscription.remove();
    }
  }

  handleBar = event => {
    this.setState({
      bar: event.nativeEvent.layout,
      layoutComputed: true,
    });
  };

  onTagDiscovered = tag => {
    const { updatePublicKey } = this.props;

    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        const text = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
        const publicKey = parseScannedCode(text);
        updatePublicKey(publicKey);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  startDetection = () => {
    NfcManager.registerTagEvent(
      this.onTagDiscovered,
      "Hold your device over the SOLO card",
      true
    );
  };

  stopDetection = () => {
    NfcManager.unregisterTagEvent();
  };

  startNfc() {
    NfcManager.start()
      .then(() => {
        if (Platform.OS === "android") {
          NfcManager.isEnabled().then(enabled => {
            if (enabled) this.startDetection();
          });

          NfcManager.onStateChanged(event => {
            if (event.state === "on") {
              // this.setState({ nfcEnabled: true });
              this.startDetection();
            } else if (event.state === "off") {
              // this.setState({ nfcEnabled: false });
              this.stopDetection();
            } else if (event.state === "turning_on") {
              // do whatever you want
            } else if (event.state === "turning_off") {
              // do whatever you want
            }
          })
            .then(sub => {
              this.stateChangedSubscription = sub;
            })
            .catch((/* err */) => {
              // console.warn(err)
            });
        } else {
          this.startDetection();
        }
      })
      .catch(() => {});
  }

  render() {
    const { navigation, publicKey, currency, updatePublicKey } = this.props;
    const { bar, layoutComputed } = this.state;

    const isValid = isValidAddress(publicKey, currency);

    const padding = 12;
    const { width: windowWidth, height: windowHeight } = Dimensions.get(
      "window"
    );

    let imageWidth = 0;
    let imageHeight = 0;

    const idealImageWidth = windowWidth - padding * 2;
    const idealImageHeight = windowHeight - padding * 2 - 120; // take header and footer into account

    if (idealImageWidth > idealImageHeight * ratio) {
      imageHeight = idealImageHeight;
      imageWidth = imageHeight * ratio;
    } else {
      imageWidth = idealImageWidth;
      imageHeight = imageWidth / ratio;
    }

    const scale = imageWidth / originalWidth;

    return (
      <Container>
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.view}>
            <Image
              source={require("../assets/card-front.png")}
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height: imageHeight,
                },
              ]}
              onLayout={this.handleBar}
            />
            {layoutComputed && (
              <Item
                regular
                success={isValid}
                style={[
                  styles.item,
                  {
                    top: bar.y + input1.y * scale,
                    left: input1.x * scale,
                    width: input1.width * scale,
                    height: input1.height * scale,
                  },
                ]}
              >
                <Input
                  placeholder="Address"
                  onChangeText={updatePublicKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={publicKey}
                  style={styles.textInput}
                />
                <Icon
                  active
                  name="md-qr-scanner"
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("QRScan");
                  }}
                />
              </Item>
            )}
          </View>
        </Content>
        <Footer style={styles.transparentBackground}>
          <FooterTab>
            <Button
              primary
              full
              disabled={!isValid}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate("Balance");
              }}
            >
              <Text style={styles.colorWhite}>Balance</Text>
            </Button>
          </FooterTab>
          <FooterTab>
            <Button
              primary
              full
              disabled={!isValid}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate("CardBackInput");
              }}
            >
              <Text style={styles.colorWhite}>Next</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(
  state => ({
    publicKey: state.inputs.publicKey,
    currency: state.inputs.currency,
  }),
  dispatch => ({
    resetPublicKey: () => {
      dispatch(resetPublicKeyAction());
    },
    updatePublicKey: key => {
      dispatch(updatePublicKeyAction(key));
    },
  })
)(CardFrontInputScreen);
