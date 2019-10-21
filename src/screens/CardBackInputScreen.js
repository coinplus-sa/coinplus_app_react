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
  Icon,
  Input,
  Button,
  Picker,
  Text,
  Item,
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

import {
    verify_solo_check,

} from "../util/generic";

const monospaceFont = Platform.OS === "android" ? "monospace" : "Menlo";

const originalWidth = 3400;
const originalHeight = 2171;
const ratio = originalWidth / originalHeight;

const adjust = 12;

// Input 1 = long input (28 chars) or 30 
const input1 = {
  x: 82 - adjust,
  y: 342,
  width: 1636 - 82,
  height: 968 - 342,
};

// Input 2 = short input (14 chars) or 30 
const input2 = {
  x: 1762 - adjust,
  y: 342,
  width: 3316 - 1762,
  height: 968 - 342,
};

// Input 3 = Card #
const input3 = {
  x: 1700 - 800,
  y: 1150,
  width: 1600,
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
  textInputSecret: {
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

class CardBackInputScreen extends Component {
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
      mode,
      deviceId,
      proDeviceId,
      updateKey1,
      updateKey2,
      updateProKey1,
      updateProKey2,
      updateDeviceId,
      updateProDeviceId,
    } = this.props;
    const { bar, layoutComputed } = this.state;

    const device = navigation.getParam("device", "first");

    const key1Length = 28;
    const key2Length = 14;
    const newkeyLength = 30;

    const key1Valid =
      device === "first"
        ? !!(key1 && (key1.length === key1Length || key1.length === newkeyLength))
        : !!(proKey1 && proKey1.length === key1Length);

    const key2Valid =
      device === "first"
        ? !!(key2 && (key2.length === key2Length || key2.length === newkeyLength))
        : !!(proKey2 && proKey2.length === key2Length);

    const currentDeviceId = device === "first" ? deviceId : proDeviceId;
    const deviceIdValid = mode === "simple" ? true : !!currentDeviceId;

    const padding = 12;
    const { width: windowWidth, height: windowHeight } = Dimensions.get(
      "window"
    );

    var key1toverif = key1;
    var key2toverif = key2;
    if (mode === "pro" && device !== "first") {
        var key1toverif = proKey1;
        var key2toverif = proKey2;
    }
    var error = null; 
    if(key1toverif.length == newkeyLength){
        var key1valid =false;
        key1valid = verify_solo_check(key1toverif, 1)
        if (!key1valid){
            error = "secret 1 checksum error, verify that you entered secret 1 correctly.";
        
        }
      }
    if(key2toverif.length == newkeyLength){
        var key2valid =false;
        key2valid = verify_solo_check(key2toverif, 1)
        if (!key2valid){
            error = "secret 2 checksum error, verify that you entered secret 2 correctly.";
        }
      }
      
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
              source={require("../assets/card-input.png")}
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
                    maxLength={newkeyLength}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={device === "first" ? key1 : proKey1}
                    multiline
                    style={[styles.textInput, styles.textInputSecret]}
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
                    maxLength={newkeyLength}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={device === "first" ? key2 : proKey2}
                    style={[styles.textInput, styles.textInputSecret]}
                  />
                </Item>
                {mode === "pro" && (
                  <Item
                    picker
                    style={[
                      styles.item,
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
                      iosIcon={<Icon name="ios-arrow-down" />}
                      selectedValue={currentDeviceId}
                      onValueChange={
                        device === "first" ? updateDeviceId : updateProDeviceId
                      }
                      style={{
                        width: input3.width * scale,
                      }}
                    >
                      <Picker.Item label="Select card #" value="" />
                      <Picker.Item label="# 1" value="1" />
                      <Picker.Item label="# 2" value="2" />
                      <Picker.Item label="# 3" value="3" />
                    </Picker>
                  </Item>
                )}
              </Fragment>
            )}
          </View>
        </Content>
        <Footer style={styles.transparentBackground}>
          <FooterTab>
            <Button
              primary
              full
              disabled={!(key1Valid && key2Valid && deviceIdValid)}
              onPress={() => {
                if (error === null){
                    Keyboard.dismiss();
                    if (mode === "pro" && device === "first") {
                      navigation.navigate("CardBackInput2");
                    } else {
                      navigation.navigate("PrivateKey");
                    }
                }
                else{
                    alert(error)
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
)(CardBackInputScreen);
