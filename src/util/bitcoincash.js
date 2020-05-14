import CoinKey from "coinkey";
import bchaddr from "bchaddrjs";

import Bitcoin from "./bitcoin";

const getWifBCH = async (secret1B58, secret2B58) => {
  const { bitcoincash } = await Bitcoin.getWif(secret1B58, secret2B58);
  return bitcoincash;
};

const getPublicKeyFromWif = wif => {
  const ck = CoinKey.fromWif(wif);
  return bchaddr.toCashAddress(ck.publicAddress);
};

const isValidPublicAddress = address => {
  if (!address) return false;

  try {
    return bchaddr.isValidAddress(address);
  } catch (e) {
    return false;
  }
};

export default {
  getWifBCH,
  getPublicKeyFromWif,
  isValidPublicAddress,
};
