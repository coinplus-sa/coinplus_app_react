import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content } from "native-base";
import QRCodeScanner from "react-native-qrcode-scanner";
import { connect } from "react-redux";
import {
  updatePublicKeyAction,
  updateDestinationAddressAction,
} from "../redux/reducers/inputs";

import parseScannedCode from "../util/scannedCodeParser";

const styles = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  cameraContainer: {
    flex: 1,
  },
});

class QRScanScreen extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(e) {
    const {
      navigation,
      updatePublicKey,
      updateDestinationAddress,
    } = this.props;
    const { qrtype, callback } = navigation.state.params;
    try {
      const publicKey = parseScannedCode(e.data);
      if (qrtype === "card") {
        updatePublicKey(publicKey);
      } else if (qrtype === "destination") {
        updateDestinationAddress(publicKey);
      }
      if (typeof(callback) !== "undefined"){
        callback(publicKey)
      }
     } finally {
      navigation.goBack();
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <QRCodeScanner
            onRead={this.onSuccess}
            cameraStyle={styles.cameraContainer}
            topViewStyle={styles.zeroContainer}
            bottomViewStyle={styles.zeroContainer}
            fadeIn={false}
            cameraProps={{
              captureAudio: false,
            }}
          />
        </Content>
      </Container>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    updatePublicKey: key => {
      dispatch(updatePublicKeyAction(key));
    },
    updateDestinationAddress: key => {
      dispatch(updateDestinationAddressAction(key));
    },
  })
)(QRScanScreen);
