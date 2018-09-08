/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import computePrivateKeyBitcoin from "./src/util/computePrivateKeyBitcoin";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\nCmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const bgColor = "#F5FCFF";
const instructionsColor = "#333333";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: instructionsColor,
    marginBottom: 5
  }
});

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: ""
    };
    this.computePrivateKey = this.computePrivateKey.bind(this);
    this.resetKey = this.resetKey.bind(this);
  }

  resetKey() {
    this.setState({
      privateKey: ""
    });
  }

  async computePrivateKey() {
    const privateKey = await computePrivateKeyBitcoin(
      "qxknCqsD18GLvkV8FNrabuFicmbz",
      "G7DRagygVQzVmE"
    );

    this.setState({
      privateKey
    });
  }

  render() {
    const { privateKey } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text>Private key: {privateKey}</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button onPress={this.computePrivateKey} title="Compute" />
        <Button onPress={this.resetKey} title="Reset" />
      </View>
    );
  }
}
