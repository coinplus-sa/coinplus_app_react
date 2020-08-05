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
  let addressWithPrefix ;
  if (!address) return false;

  try {
    if (address.split(":").length == 1){
      addressWithPrefix =  "bitcoincash:"+address
    }
    else{
      if (address.split(":")[0] != "bitcoincash"){
        return false
      }
      addressWithPrefix = address
    }
    return bchaddr.isValidAddress(addressWithPrefix);
  } catch (e) {
    return false;
  }
};

const getBalance = address => {
  return bitbox.Address.details(address)
    .then(balance => {
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
