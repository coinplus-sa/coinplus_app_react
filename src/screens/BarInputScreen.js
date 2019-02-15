import React, { Component, Fragment } from "react";
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
  Picker,
  Icon,
} from "native-base";
import { connect } from "react-redux";

import {
  resetKeysAction,
  resetProKeysAction,
  resetPublicKeyAction,
  resetDeviceIdAction,
  resetProDeviceIdAction,
  updateKey1Action,
  updateKey2Action,
  updateProKey1Action,
  updateProKey2Action,
  updatePublicKeyAction,
  updateDeviceIdAction,
  updateProDeviceIdAction,
} from "../redux/reducers/inputs";
import { isValidAddress } from "../util/generic";

const monospaceFont = Platform.OS === "android" ? "monospace" : "Menlo";

const originalWidth = 1120;
const originalHeight = 1782;
const ratio = originalWidth / originalHeight;

const adjust = 7;

// Input 1 = long input (28 chars)
const input1 = {
  x: 194 - adjust,
  y: 407,
  width: 926 - 194,
  height: 731 - 407,
};

// Input 2 = short input (14 chars)
const input2 = {
  x: 194 - adjust,
  y: 1518,
  width: 926 - 194,
  height: 1695 - 1518,
};

// Input 3 = Bar #
const input3 = {
  x: 560 - 732 / 2,
  y: 1345,
  width: 732,
};

const publicKeyInput = {
  x: 105 - adjust,
  y: 1211,
  width: 1015 - 105,
  height: 1325 - 1211,
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
    textAlignVertical: "center",
  },
  textInputSecret1: {
    lineHeight: 18,
    height: 36,
    textAlignVertical: "top",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  colorWhite: {
    color: "#fff",
  },
});

class BarInputScreen extends Component {
  state = {
    bar: {},
    layoutComputed: false,
  };

  constructor(props) {
    super(props);

    const device = props.navigation.getParam("device", "first");

    if (device === "first") {
      props.resetKeys();
      props.resetDeviceId();
      props.resetPublicKey();
    } else {
      props.resetProKeys();
      props.resetProDeviceId();
    }
  }

  handleBar = event => {
    this.setState({
      bar: event.nativeEvent.layout,
      layoutComputed: true,
    });
  };

  render() {
    const {
      navigation,
      key1,
      key2,
      proKey1,
      proKey2,
      publicKey,
      currency,
      updateKey1,
      updateKey2,
      updateProKey1,
      updateProKey2,
      updateDeviceId,
      updateProDeviceId,
      updatePublicKey,
      mode,
      deviceId,
      proDeviceId,
    } = this.props;
    const { bar, layoutComputed } = this.state;

    const device = navigation.getParam("device", "first");

    const key1Length = 28;
    const key2Length = 14;

    const key1Valid =
      device === "first"
        ? !!(key1 && key1.length === key1Length)
        : !!(proKey1 && proKey1.length === key1Length);

    const key2Valid =
      device === "first"
        ? !!(key2 && key2.length === key2Length)
        : !!(proKey2 && proKey2.length === key2Length);

    const currentDeviceId = device === "first" ? deviceId : proDeviceId;
    const deviceIdValid = mode === "simple" ? true : !!currentDeviceId;

    const publicAddressValid = isValidAddress(publicKey, currency);

    const padding = 24;
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
              source={
                mode === "pro"
                  ? require("../assets/bar-input.png")
                  : require("../assets/bar-input-logo.png")
              }
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
              onLayout={this.handleBar}
            />
            {layoutComputed && (
              <Fragment>
                <Item
                  regular
                  success={key1Valid}
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
                    placeholder="Secret 1"
                    onChangeText={
                      device === "first" ? updateKey1 : updateProKey1
                    }
                    maxLength={key1Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={device === "first" ? key1 : proKey1}
                    multiline
                    style={[styles.textInput, styles.textInputSecret1]}
                  />
                </Item>
                <Item
                  regular
                  success={key2Valid}
                  style={[
                    styles.item,
                    {
                      top: bar.y + input2.y * scale,
                      left: input2.x * scale,
                      width: input2.width * scale,
                      height: input2.height * scale,
                    },
                  ]}
                >
                  <Input
                    placeholder="Secret 2"
                    onChangeText={
                      device === "first" ? updateKey2 : updateProKey2
                    }
                    maxLength={key2Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={device === "first" ? key2 : proKey2}
                    style={styles.textInput}
                  />
                </Item>
                {mode === "pro" && (
                  <Item
                    picker
                    style={[
                      styles.item,
                      styles.transparentBackground,
                      {
                        top: bar.y + input3.y * scale,
                        left: input3.x * scale,
                        width: input3.width * scale,
                        height: 40,
                      },
                    ]}
                  >
                    <Picker
                      mode="dropdown"
                      //iosHeader="Select bar #"
                      iosIcon={<Icon name="ios-arrow-down" />}
                      placeholder="Select bar #"
                      placeholderStyle={{ color: "#444444" }}
                      placeholderIconColor="#444444"
                      selectedValue={currentDeviceId}
                      onValueChange={
                        device === "first" ? updateDeviceId : updateProDeviceId
                      }
                      style={{ width: input3.width * scale }}
                    >
                      <Picker.Item label="Select bar #" value="" />
                      <Picker.Item label="# 1" value="1" />
                      <Picker.Item label="# 2" value="2" />
                      <Picker.Item label="# 3" value="3" />
                    </Picker>
                  </Item>
                )}
                <Item
                  regular
                  success={publicAddressValid}
                  style={[
                    styles.item,
                    {
                      top: bar.y + publicKeyInput.y * scale,
                      left: publicKeyInput.x * scale,
                      width: publicKeyInput.width * scale,
                      height: publicKeyInput.height * scale,
                    },
                  ]}
                >
                  <Input
                    placeholder="Public key"
                    onChangeText={updatePublicKey}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={publicKey}
                    style={styles.textInput}
                  />
                </Item>
              </Fragment>
            )}
          </View>
        </Content>
        <Footer style={styles.transparentBackground}>
          <FooterTab>
            <Button
              primary
              full
              disabled={
                !(key1Valid && key2Valid && publicAddressValid && deviceIdValid)
              }
              onPress={() => {
                Keyboard.dismiss();
                if (mode === "pro" && device === "first") {
                  navigation.navigate("BarInput2");
                } else {
                  navigation.navigate("PrivateKey");
                }
              }}
            >
              <Text style={styles.colorWhite}>
                {mode === "pro" && device === "first" ? "Next" : "Process"}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(
  state => ({
    key1: state.inputs.key1,
    key2: state.inputs.key2,
    proKey1: state.inputs.proKey1,
    proKey2: state.inputs.proKey2,
    publicKey: state.inputs.publicKey,
    currency: state.inputs.currency,
    mode: state.inputs.mode,
    deviceId: state.inputs.deviceId,
    proDeviceId: state.inputs.proDeviceId,
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    resetProKeys: () => {
      dispatch(resetProKeysAction());
    },
    resetPublicKey: () => {
      dispatch(resetPublicKeyAction());
    },
    resetDeviceId: () => {
      dispatch(resetDeviceIdAction());
    },
    resetProDeviceId: () => {
      dispatch(resetProDeviceIdAction());
    },
    updateKey1: key => {
      dispatch(updateKey1Action(key));
    },
    updateKey2: key => {
      dispatch(updateKey2Action(key));
    },
    updateProKey1: key => {
      dispatch(updateProKey1Action(key));
    },
    updateProKey2: key => {
      dispatch(updateProKey2Action(key));
    },
    updatePublicKey: key => {
      dispatch(updatePublicKeyAction(key));
    },
    updateDeviceId: deviceId => {
      dispatch(updateDeviceIdAction(deviceId));
    },
    updateProDeviceId: deviceId => {
      dispatch(updateProDeviceIdAction(deviceId));
    },
  })
)(BarInputScreen);
