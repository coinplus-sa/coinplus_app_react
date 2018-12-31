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
} from "native-base";
import { connect } from "react-redux";
import {
  resetKeysAction,
  resetPublicKeyAction,
  updateKey1Action,
  updateKey2Action,
  updatePublicKeyAction,
} from "../redux/reducers/inputs";

const monospaceFont = Platform.OS === "android" ? "monospace" : "Menlo";

const originalWidth = 1120;
const originalHeight = 1782;
const ratio = originalWidth / originalHeight;

const adjust = 7;

const input1 = {
  x: 194 - adjust,
  y: 407,
  width: 926 - 194,
  height: 731 - 407,
};

const input2 = {
  x: 194 - adjust,
  y: 1513,
  width: 926 - 194,
  height: 1690 - 1513,
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
    props.resetKeys();
    props.resetPublicKey();
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
      publicKey,
      updateKey1,
      updateKey2,
      updatePublicKey,
    } = this.props;
    const { bar, layoutComputed } = this.state;

    const key1Length = 28;
    const key2Length = 14;

    const key1Valid = !!(key1 && key1.length === key1Length);
    const key2Valid = !!(key2 && key2.length === key2Length);

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
              source={require("../assets/bar-input.png")}
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
                    onChangeText={updateKey1}
                    maxLength={key1Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={key1}
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
                    onChangeText={updateKey2}
                    maxLength={key2Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={key2}
                    style={styles.textInput}
                  />
                </Item>
                <Item
                  regular
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
              disabled={!(key1Valid && key2Valid)}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate("PrivateKey");
              }}
            >
              <Text style={styles.colorWhite}>Process</Text>
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
    publicKey: state.inputs.publicKey,
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    resetPublicKey: () => {
      dispatch(resetPublicKeyAction());
    },
    updateKey1: key => {
      dispatch(updateKey1Action(key));
    },
    updateKey2: key => {
      dispatch(updateKey2Action(key));
    },
    updatePublicKey: key => {
      dispatch(updatePublicKeyAction(key));
    },
  })
)(BarInputScreen);
