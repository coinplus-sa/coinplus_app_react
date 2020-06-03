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

const getBalance = address => {
  return fetch(
    `https://api.blockcypher.com/v1/bch/main/addrs/${address}/balance`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      return {
        finalBalance: result.final_balance * 0.00000001,
        unconfirmedBalance: result.unconfirmed_balance * 0.00000001,
      };
    });
};
export const historyURL = "https://live.blockcypher.com/bch/address/";

export default {
  getWifBCH,
  getBalance,
  getPublicKeyFromWif,
  isValidPublicAddress,
  historyURL,
};
