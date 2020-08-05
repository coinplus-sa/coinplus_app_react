import Decimal from "decimal.js";
import { bitcoinExp } from "./bitcoin";

const bitcoin = require("bitcoinjs-lib");
const coininfo = require("coininfo");

/**
 * Send bitcoin in testnet using BlockCypher
 * @param {number} amount - Bitcoin amount in BTC
 * @param {string} to - output Bitcoin wallet address
 * @param {string} from - input Bitcoin wallet address
 * @param {string} wif
 */

const API_BTC_TXS_CREATE = "https://api.blockcypher.com/v1/btc/main/txs/new";
const API_BTC_TXS_SEND = "https://api.blockcypher.com/v1/btc/main/txs/send";
const API_LTC_TXS_CREATE = "https://api.blockcypher.com/v1/ltc/main/txs/new";
const API_LTC_TXS_SEND = "https://api.blockcypher.com/v1/ltc/main/txs/send";
const getApiUrlFromCur = cur => {
  let API_TXS_CREATE, API_TXS_SEND;
  if (cur === "btc"){
    API_TXS_CREATE = API_BTC_TXS_CREATE;
    API_TXS_SEND = API_BTC_TXS_SEND;
  }
  if (cur === "ltc"){
    API_TXS_SEND = API_LTC_TXS_SEND;
    API_TXS_CREATE = API_LTC_TXS_CREATE;
  }
  return {API_TXS_SEND, API_TXS_CREATE}

}
const getNetwork = cur => {
  let network;
  if (cur === "btc"){
    network = bitcoin.networks.bitcoin;
  }
  if (cur === "ltc"){
    let litecoinNetwork = coininfo.litecoin.main
    network = litecoinNetwork.toBitcoinJS();
  }

  return { network }
}



const getFees = (from, cur) => {
  const {API_TXS_SEND, API_TXS_CREATE} = getApiUrlFromCur(cur);
  return fetch(API_TXS_CREATE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [{ addresses: [from] }],
      outputs: [{ addresses: [from], value: 0 }],
    }),
  })
    .then(response => {
      return response.text();
    })
    .then(restext => {
      let res;
      try {
        res = JSON.parse(restext);
      } catch {
        throw new Error(`malformed json answer from the server:${restext}`);
      }
      if (res.tx !== undefined && res.tx.fees != undefined){
        return Decimal(res.tx.fees)
        .div(bitcoinExp)
        .toString();

      }
      if (res.errors) {
        throw new Error(res.errors.map(err => err.error ).join(", "));
      }
      if (res.error) {
        throw new Error(res.error);
      }
      return '0';
    });
};


const sendBitcoin = (amount, to, from, wif, fee, cur) => {
  const {API_TXS_SEND, API_TXS_CREATE} = getApiUrlFromCur(cur);

  const { network } = getNetwork(cur);

  const keys = bitcoin.ECPair.fromWIF(wif, network);
  return fetch(API_TXS_CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [{ addresses: [from] }],
      // convert amount from BTC to Satoshis
      fees: Decimal(fee)
        .mul(bitcoinExp)
        .floor()
        .toNumber(),
      outputs: [
        {
          addresses: [to],
          value: Decimal(amount)
            .mul(bitcoinExp)
            .floor()
            .toNumber(),
        },
      ],
    }),
  })
    .then(response => {
      return response.text();
    })
    .then(res => {
      let tmptx;
      try {
        tmptx = JSON.parse(res);
      } catch {
        throw new Error(`malformed json answer from the server:${res}`);
      }
      if (tmptx.errors) {
        throw new Error(tmptx.errors.map(err => err.error ).join(", "));
      }
    // signing each of the hex-encoded string required to finalize the transaction
      tmptx.pubkeys = [];
      tmptx.signatures = tmptx.tosign.map(tosign => {
        tmptx.pubkeys.push(keys.publicKey.toString("hex"));
        const buftosign = Buffer.from(tosign, "hex");
        const sig = keys.sign(buftosign);
        const encodedSignature = bitcoin.script.signature.encode(
          sig,
          bitcoin.Transaction.SIGHASH_ALL
        );
        const hexStr = encodedSignature.toString("hex").slice(0, -2);
        return hexStr;
      });
      return fetch(API_TXS_SEND, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tmptx),
      });
    })

    .then(response => {
      return response.text();
    })
    .then(res => {
      let finaltx;

      try {
        finaltx = JSON.parse(res);
      } catch {
        throw new Error(`malformed json answer from the server:${res}`);
      }
      if (finaltx.errors) {
        throw new Error(finaltx.errors.map(err => err.error ).join(", "));
      }
    return finaltx.tx.hash;
    });
};

export default {
  getFees,
  sendBitcoin,
};
