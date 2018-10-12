import { createStackNavigator } from "react-navigation";

import SelectionScreen from "../screens/SelectionScreen";
import BarInputScreen from "../screens/BarInputScreen";
import CardInputScreen from "../screens/CardInputScreen";
import PrivateKeyScreen from "../screens/PrivateKeyScreen";

export default createStackNavigator(
  {
    Selection: {
      screen: SelectionScreen
    },
    BarInput: {
      screen: BarInputScreen
    },
    CardInput: {
      screen: CardInputScreen
    },
    PrivateKey: {
      screen: PrivateKeyScreen
    }
  },
  {
    initialRouteName: "Selection"
  }
);
