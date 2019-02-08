export const UPDATE_PUBLIC_KEY = "UPDATE_PUBLIC_KEY";
export const UPDATE_KEY_1 = "UPDATE_KEY_1";
export const UPDATE_KEY_2 = "UPDATE_KEY_2";
export const UPDATE_PRO_KEY_1 = "UPDATE_PRO_KEY_1";
export const UPDATE_PRO_KEY_2 = "UPDATE_PRO_KEY_2";
export const RESET_KEYS = "RESET_KEYS";
export const RESET_PUBLIC_KEY = "RESET_PUBLIC_KEY";
export const UPDATE_CURRENCY = "UPDATE_CURRENCY";
export const UPDATE_MODE = "UPDATE_MODE";

const initialState = {
  // Public key doesn't depend on the mode (simple/pro)
  publicKey: "",
  // First card
  key1: "",
  key2: "",
  id: 1, // 1 | 2 | 3
  // Second card
  proKey1: "",
  proKey2: "",
  proId: 2,
  // Currency
  currency: "btc", // "btc" | "eth"
  // Mode
  mode: "simple", // "simple" | "pro"
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
    case UPDATE_PUBLIC_KEY:
      return Object.assign({}, state, { publicKey: action.publicKey });
    case RESET_KEYS:
      return Object.assign({}, state, { key1: "", key2: "" });
    case RESET_PUBLIC_KEY:
      return Object.assign({}, state, { publicKey: "" });
    case UPDATE_CURRENCY:
      return Object.assign({}, state, { currency: action.currency });
    case UPDATE_MODE:
      return Object.assign({}, state, { mode: action.mode });
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

export function updateKey2Action(key2) {
  return {
    type: UPDATE_KEY_2,
    key2,
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

export function resetPublicKeyAction() {
  return {
    type: RESET_PUBLIC_KEY,
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
