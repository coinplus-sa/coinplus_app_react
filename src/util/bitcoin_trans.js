import request from "request";
import bitcoin from "bitcoinjs-lib";

const bitcoinNetwork = bitcoin.networks.testnet;

/**
 * Send bitcoin in testnet using BlockCypher
 * @param {number} amount - Bitcoin amount in BTC
 * @param {string} to - output Bitcoin wallet address
 * @param {string} from - input Bitcoin wallet address
 * @param {string} wif
 */
const sendBitcoin = function(amount, to, from, wif) {
  const keys = bitcoin.ECPair.fromWIF(wif, bitcoinNetwork);
  console.log(keys);
  return new Promise(function(resolve, reject) {
    // create tx skeleton
    request.post(
      {
        url: "https://api.blockcypher.com/v1/btc/test3/txs/new",
        body: JSON.stringify({
          inputs: [{ addresses: [from] }],
          // convert amount from BTC to Satoshis
          fees: 4000,
          outputs: [{ addresses: [to], value: amount * Math.pow(10, 8) }],
        }),
      },
      function(err, res, body) {
        if (err) {
          reject(err);
        } else {
          const tmptx = JSON.parse(body);
          console.log(tmptx);
          // signing each of the hex-encoded string required to finalize the transaction
          tmptx.pubkeys = [];
          tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
            tmptx.pubkeys.push(keys.publicKey.toString("hex"));
            console.log("pk", keys.publicKey);
            console.log("sk", keys.__D);
            const buftosign = new Buffer.from(tosign, "hex");
            console.log(buftosign);
            const sig = keys.sign(buftosign);
            console.log("sig", sig);
            const encodedSignature = bitcoin.script.signature.encode(
              sig,
              bitcoin.Transaction.SIGHASH_ALL
            );
            const hexStr = encodedSignature.toString("hex").slice(0, -2);
            return hexStr;
          });
          console.log(tmptx);
          // sending back the transaction with all the signatures to broadcast
          request.post(
            {
              url: "https://api.blockcypher.com/v1/btc/test3/txs/send",
              body: JSON.stringify(tmptx),
            },
            function(err, res, body) {
              console.log(body, res.body);
              if (err) {
                reject(err);
              } else {
                // return tx hash as feedback
                const finaltx = JSON.parse(body);
                resolve(finaltx.tx.hash);
              }
            }
          );
        }
      }
    );
  });
};
// Our private key and address
const wif = "cVn9yuLB8PqtG7Poerz9bAQicSi61tFw94NnFEUvLNABcfXskss6";
// Address we are sending Bitcoin to
const addressTo = "mrzH3vuUspsAYAc8gFvaPddmcGmZKtRYQQ";
const addressFrom = "msychtr6RkAhkPEZjitzcvG2u84TLL9vXk";
// Start the creating our transaction
const amount = 50000; // Sending amount must be in satoshis
const fee = 50000; // Fee is in satoshis
sendBitcoin(0.001, addressTo, addressFrom, wif)
  .then(res => {
    console.log(res);
  })
  .catch(res => {
    console.log(res);
  });
