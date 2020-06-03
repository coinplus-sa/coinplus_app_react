import Decimal from "decimal.js";
import { bitcoinExp } from "./bitcoin";

const bitcoin = require("bitcoinjs-lib");

const bitcoinNetwork = bitcoin.networks.bitcoin;
/**
 * Send bitcoin in testnet using BlockCypher
 * @param {number} amount - Bitcoin amount in BTC
 * @param {string} to - output Bitcoin wallet address
 * @param {string} from - input Bitcoin wallet address
 * @param {string} wif
 */

const API_TXS_CREATE = "https://api.blockcypher.com/v1/btc/main/txs/new";
const API_TXS_SEND = "https://api.blockcypher.com/v1/btc/main/txs/send";
const getFees = from => {
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
      console.log(restext);
      try {
        res = JSON.parse(restext);
        if (res.error) {
          throw res.error;
        }
      } catch {
        throw { errormsg: `malformed json answer from the server:${res}` };
      }
      return Decimal(res.tx.fees)
        .div(bitcoinExp)
        .toString();
    });
};

const sendBitcoin = (amount, to, from, wif, fee) => {
  const keys = bitcoin.ECPair.fromWIF(wif, bitcoinNetwork);
  return fetch(API_TXS_CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [{ addresses: [from] }],
      // convert amount from BTC to Satoshis
      fees: Decimal(fee)
        .mul(bitcoinExp).floor()
        .toNumber(),
      outputs: [
        {
          addresses: [to],
          value: Decimal(amount)
            .mul(bitcoinExp).floor()
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
      console.log(res);
      try {
        tmptx = JSON.parse(res);
        if (tmptx.errors) {
          throw tmptx.errors;
        }
      } catch {
        throw { errormsg: `malformed json answer from the server:${res}` };
      }
      // signing each of the hex-encoded string required to finalize the transaction
      tmptx.pubkeys = [];
      tmptx.signatures = tmptx.tosign.map(function(tosign) {
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
      console.log(res);

      try {
        finaltx = JSON.parse(res);
        console.log(res);
        if (finaltx.errors) {
          throw finaltx.errors;
        }
      } catch {
        throw { errormsg: `malformed json answer from the server:${res}` };
      }
      return finaltx.tx.hash;
    });
};

export default {
  getFees,
  sendBitcoin,
};
