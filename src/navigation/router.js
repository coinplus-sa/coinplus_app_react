import React from "react";
import { Image, Platform } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import SelectionScreen from "../screens/SelectionScreen";
import BarInputScreen from "../screens/BarInputScreen";
import CardFrontInputScreen from "../screens/CardFrontInputScreen";
import CardBackInputScreen from "../screens/CardBackInputScreen";
import PrivateKeyScreen from "../screens/PrivateKeyScreen";
import QRScanScreen from "../screens/QRScanScreen";

import logo from "../assets/coinplus_logo.png";

const originalWidth = 1167;
const originalHeight = 221;

// 75% of the available space
const logoHeight = (Platform.OS === "ios" ? 44 : 56) * 0.6;

export default createAppContainer(
  createStackNavigator(
    {
      Selection: {
        screen: SelectionScreen,
      },
      BarInput: {
        screen: BarInputScreen,
      },
      CardFrontInput: {
        screen: CardFrontInputScreen,
      },
      CardBackInput: {
        screen: CardBackInputScreen,
      },
      PrivateKey: {
        screen: PrivateKeyScreen,
      },
      QRScan: {
        screen: QRScanScreen,
      },
    },
    {
      initialRouteName: "Selection",
      headerLayoutPreset: "center",
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: "#1565c0",
        },
        headerTintColor: "#fff",
        headerTitle: (
          <Image
            source={logo}
            resizeMode="contain"
            style={{
              height: logoHeight,
              width: (logoHeight / originalHeight) * originalWidth,
            }}
          />
        ),
      },
    }
  )
);
