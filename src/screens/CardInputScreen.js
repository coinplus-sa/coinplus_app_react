import React, { Component, Fragment } from "react";
import { Image, Keyboard, Dimensions, View } from "react-native";

import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Left,
  Body,
  Right,
  Input,
  Button,
  Text,
  Icon,
  Item
} from "native-base";
import { connect } from "react-redux";
import {
  resetKeysAction,
  updateKey1Action,
  updateKey2Action
} from "../redux/reducers/inputs";

import logo from "../assets/logo.png";

const ratio = 1603 / 1024;

const adjust = 12;

const input1 = {
  x: 39 - adjust,
  y: 211,
  width: 771 - 39,
  height: 387 - 211
};

const input2 = {
  x: 831 - adjust,
  y: 211,
  width: 1563 - 831,
  height: 387 - 211
};

class CardInputScreen extends Component {
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

    const padding = 10;
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

    const scale = imageWidth / 1603;

    return (
      <Container>
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
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
                    placeholder="secret1"
                    onChangeText={updateKey1}
                    maxLength={key1Length}
                    autoCorrect={false}
                    value={key1}
                    style={{ fontSize: 16 }}
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
                    placeholder="secret2"
                    onChangeText={updateKey2}
                    maxLength={key2Length}
                    autoCorrect={false}
                    value={key2}
                    style={{ fontSize: 16 }}
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

CardInputScreen.navigationOptions = ({ navigation }) => ({
  header: (
    <Header>
      <Left>
        <Button transparent onPress={() => navigation.navigate("Selection")}>
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
)(CardInputScreen);
