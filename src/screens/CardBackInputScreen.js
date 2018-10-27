import React, { Component, Fragment } from "react";
import { Image, Keyboard, Dimensions, View, Platform } from "react-native";

import {
  Container,
  Content,
  Footer,
  FooterTab,
  Input,
  Button,
  Text,
  Item
} from "native-base";
import { connect } from "react-redux";
import {
  resetKeysAction,
  updateKey1Action,
  updateKey2Action
} from "../redux/reducers/inputs";

const monospaceFont = Platform.OS === "android" ? "monospace" : "Menlo";

const originalWidth = 3400;
const originalHeight = 2171;
const ratio = originalWidth / originalHeight;

const adjust = 12;

const input1 = {
  x: 82 - adjust,
  y: 342,
  width: 1636 - 82,
  height: 968 - 342
};

const input2 = {
  x: 1762 - adjust,
  y: 342,
  width: 3316 - 1762,
  height: 717 - 342
};

class CardBackInputScreen extends Component {
  state = {
    bar: {},
    layoutComputed: false
  };

  constructor(props) {
    super(props);
    props.resetKeys();
  }

  handleBar = event => {
    this.setState({
      bar: event.nativeEvent.layout,
      layoutComputed: true
    });
  };

  render() {
    const { navigation, key1, key2, updateKey1, updateKey2 } = this.props;
    const { bar, layoutComputed } = this.state;

    const key1Length = 28;
    const key2Length = 14;
    const key1Valid = !!(key1 && key1.length === key1Length);
    const key2Valid = !!(key2 && key2.length === key2Length);

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
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              flexGrow: 1,
              position: "relative"
            }}
          >
            <Image
              source={require("../assets/card-input.png")}
              style={{
                width: imageWidth,
                height: imageHeight,
                maxWidth: "100%",
                maxHeight: "100%"
              }}
              onLayout={this.handleBar}
            />
            {layoutComputed && (
              <Fragment>
                <Item
                  regular
                  success={key1Valid}
                  style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    top: bar.y + input1.y * scale,
                    left: input1.x * scale,
                    width: input1.width * scale,
                    height: input1.height * scale
                  }}
                >
                  <Input
                    placeholder="Secret 1"
                    onChangeText={updateKey1}
                    maxLength={key1Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={key1}
                    multiline
                    style={{
                      fontFamily: monospaceFont,
                      fontSize: 14,
                      lineHeight: 18,
                      height: 36,
                      paddingVertical: 0,
                      textAlignVertical: "top"
                    }}
                  />
                </Item>
                <Item
                  regular
                  success={key2Valid}
                  style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    top: bar.y + input2.y * scale,
                    left: input2.x * scale,
                    width: input2.width * scale,
                    height: input2.height * scale
                  }}
                >
                  <Input
                    placeholder="Secret 2"
                    onChangeText={updateKey2}
                    maxLength={key2Length}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={key2}
                    style={{
                      fontFamily: monospaceFont,
                      fontSize: 14,
                      paddingVertical: 0,
                      textAlignVertical: "center"
                    }}
                  />
                </Item>
              </Fragment>
            )}
          </View>
        </Content>
        <Footer
          style={{
            backgroundColor: "transparent"
          }}
        >
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
              <Text style={{ color: "#fff" }}>Process</Text>
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
    key2: state.inputs.key2
  }),
  dispatch => ({
    resetKeys: () => {
      dispatch(resetKeysAction());
    },
    updateKey1: key => {
      dispatch(updateKey1Action(key));
    },
    updateKey2: key => {
      dispatch(updateKey2Action(key));
    }
  })
)(CardBackInputScreen);
