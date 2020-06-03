export const UPDATE_PUBLIC_KEY = "UPDATE_PUBLIC_KEY";
export const UPDATE_KEY_1 = "UPDATE_KEY_1";
export const UPDATE_KEY_2 = "UPDATE_KEY_2";
export const UPDATE_PRO_KEY_1 = "UPDATE_PRO_KEY_1";
export const UPDATE_PRO_KEY_2 = "UPDATE_PRO_KEY_2";
export const UPDATE_DEVICE_ID = "UPDATE_DEVICE_ID";
export const UPDATE_PRO_DEVICE_ID = "UPDATE_PRO_DEVICE_ID";
export const RESET_KEYS = "RESET_KEYS";
export const RESET_PRO_KEYS = "RESET_PRO_KEYS";
export const RESET_PUBLIC_KEY = "RESET_PUBLIC_KEY";
export const RESET_DEVICE_ID = "RESET_DEVICE_ID";
export const RESET_PRO_DEVICE_ID = "RESET_PRO_DEVICE_IDS";
export const UPDATE_CURRENCY = "UPDATE_CURRENCY";
export const UPDATE_MODE = "UPDATE_MODE";
export const UPDATE_PRIVATE_KEY = "UPDATE_PRIVATE_KEY";
export const UPDATE_DESTINATION_ADDRESS = "UPDATE_DESTINATION_ADDRESS";
export const UPDATE_FEE = "UPDATE_FEE";
export const UPDATE_SEND_AMOUNT = "UPDATE_SEND_AMOUNT";
const initialState = {
  // Public key doesn't depend on the mode (simple/pro)
  publicKey: "",
  // First card
  key1: "",
  key2: "",
  deviceId: "", // "" | "1" | "2" | "3"
  // Second card
  proKey1: "",
  proKey2: "",
  proDeviceId: "", // "" | "1" | "2" | "3"
  // Currency
  currency: "btc", // "btc" | "eth"
  balance: 0,
  computedPrivateKey: "",
  // Mode
  mode: "simple", // "simple" | "pro",
  destinationAddress: "",
  fee: "",
  sendAmount: "",
};

/*
 * Reducer
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_KEY_1:
      return Object.assign({}, state, { key1: action.key1 });
    case UPDATE_KEY_2:
      return Object.assign({}, state, { key2: action.key2 });
    case UPDATE_PRO_KEY_1:
      return Object.assign({}, state, { proKey1: action.key1 });
    case UPDATE_PRO_KEY_2:
      return Object.assign({}, state, { proKey2: action.key2 });
    case UPDATE_PUBLIC_KEY:
      return Object.assign({}, state, { publicKey: action.publicKey });
    case UPDATE_DEVICE_ID:
      return Object.assign({}, state, { deviceId: action.deviceId });
    case UPDATE_PRO_DEVICE_ID:
      return Object.assign({}, state, { proDeviceId: action.deviceId });
    case RESET_KEYS:
      return Object.assign({}, state, {
        key1: "",
        key2: "",
      });
    case RESET_PRO_KEYS:
      return Object.assign({}, state, {
        proKey1: "",
        proKey2: "",
      });
    case RESET_PUBLIC_KEY:
      return Object.assign({}, state, { publicKey: "" });
    case RESET_DEVICE_ID:
      return Object.assign({}, state, { deviceId: "" });
    case RESET_PRO_DEVICE_ID:
      return Object.assign({}, state, { proDeviceId: "" });
    case UPDATE_CURRENCY:
      return Object.assign({}, state, { currency: action.currency });
    case UPDATE_MODE:
      return Object.assign({}, state, { mode: action.mode });
    case UPDATE_PRIVATE_KEY:
      return Object.assign({}, state, {
        computedPrivateKey: action.computedPrivateKey,
      });
    case UPDATE_DESTINATION_ADDRESS:
      return Object.assign({}, state, {
        destinationAddress: action.destinationAddress,
      });
    case UPDATE_FEE:
      return Object.assign({}, state, { fee: action.fee });
    case UPDATE_SEND_AMOUNT:
      return Object.assign({}, state, { sendAmount: action.sendAmount });
    default:
      return state;
  }
}

/*
 * Actions
 */
export function updateKey1Action(key1) {
  return {
    type: UPDATE_KEY_1,
    key1,
  };
}

export function updateComputedPrivateKeyAction(computedPrivateKey) {
  return {
    type: UPDATE_PRIVATE_KEY,
    computedPrivateKey,
  };
}

export function updateDestinationAddressAction(destinationAddress) {
  return {
    type: UPDATE_DESTINATION_ADDRESS,
    destinationAddress,
  };
}

export function updateFeeAction(fee) {
  console.log(`updateFeeAction ${fee}`);
  return {
    type: UPDATE_FEE,
    fee,
  };
}
export function updateSendAmountAction(sendAmount) {
  return {
    type: UPDATE_SEND_AMOUNT,
    sendAmount,
  };
}

export function updateKey2Action(key2) {
  return {
    type: UPDATE_KEY_2,
    key2,
  };
}

export function updateProKey1Action(key1) {
  return {
    type: UPDATE_PRO_KEY_1,
    key1,
  };
}

export function updateProKey2Action(key2) {
  return {
    type: UPDATE_PRO_KEY_2,
    key2,
  };
}

export function updateDeviceIdAction(deviceId) {
  return {
    type: UPDATE_DEVICE_ID,
    deviceId,
  };
}

export function updateProDeviceIdAction(deviceId) {
  return {
    type: UPDATE_PRO_DEVICE_ID,
    deviceId,
  };
}

export function updatePublicKeyAction(publicKey) {
  return {
    type: UPDATE_PUBLIC_KEY,
    publicKey,
  };
}

export function resetKeysAction() {
  return {
    type: RESET_KEYS,
  };
}

export function resetProKeysAction() {
  return {
    type: RESET_PRO_KEYS,
  };
}

export function resetPublicKeyAction() {
  return {
    type: RESET_PUBLIC_KEY,
  };
}

export function resetDeviceIdAction() {
  return {
    type: RESET_DEVICE_ID,
  };
}

export function resetProDeviceIdAction() {
  return {
    type: RESET_PRO_DEVICE_ID,
  };
}

export function updateCurrencyAction(currency) {
  return {
    type: UPDATE_CURRENCY,
    currency,
  };
}

export function updateModeAction(mode) {
  return {
    type: UPDATE_MODE,
    mode,
  };
}
