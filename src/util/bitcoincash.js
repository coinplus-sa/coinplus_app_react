import CoinKey from "coinkey";
import bchaddr from "bchaddrjs";
import { BITBOX } from 'bitbox-sdk'
let bitbox = new BITBOX();
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
  return bitbox.Address.details(address)
    .then(balance => {
      console.log({
        finalBalance: balance.balance,
        unconfirmedBalance: balance.unconfirmedBalance,
        })
      return {
        finalBalance: balance.balance,
        unconfirmedBalance: balance.unconfirmedBalance,
        }
          });
};
const historyURL = "https://explorer.bitcoin.com/bch/address/";

export default {
  getWifBCH,
  getBalance,
  getPublicKeyFromWif,
  isValidPublicAddress,
  historyURL,
};
