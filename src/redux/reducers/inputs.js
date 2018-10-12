export const UPDATE_KEY_1 = "UPDATE_KEY_1";
export const UPDATE_KEY_2 = "UPDATE_KEY_2";
export const RESET_KEYS = "RESET_KEYS";
export const UPDATE_CURRENCY = "UPDATE_CURRENCY";

const initialState = {
  key1: "",
  key2: "",
  currency: "btc"
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
    case RESET_KEYS:
      return Object.assign({}, state, { key1: "", key2: "" });
    case UPDATE_CURRENCY:
      return Object.assign({}, state, { currency: action.currency });
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
    key1
  };
}

export function updateKey2Action(key2) {
  return {
    type: UPDATE_KEY_2,
    key2
  };
}

export function resetKeysAction() {
  return {
    type: RESET_KEYS
  };
}

export function updateCurrencyAction(currency) {
  return {
    type: UPDATE_CURRENCY,
    currency
  };
}
