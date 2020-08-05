import Decimal from "decimal.js";
import { bitcoinExp } from "./bitcoin";
import { BITBOX } from 'bitbox-sdk'
let bitbox = new BITBOX();

import BitcoinCash from "./bitcoincash";
//import { toBase58Check } from "bitcoinjs-lib/types/address";

const constructTransaction = async (amount, to, from, wif, fee) =>
{
  bal = await BitcoinCash.getBalance(from);
  let rest = Decimal(bal.finalBalance).sub(Decimal(fee)).sub(Decimal(amount)).mul(Decimal(bitcoinExp)).add(
    Decimal(bal.unconfirmedBalance))

  let utxo = await bitbox.Address.utxo(from);
  let signingECpair;
  let paperWalletFromAddress;
  signingECpair = bitbox.ECPair.fromWIF(wif);
  paperWalletFromAddress = bitbox.ECPair.toCashAddress(signingECpair);
  // Instantiate a new transaction
  let transactionBuilder = new bitbox.TransactionBuilder();

  let totalSendingSatoshis = Decimal(amount).mul(Decimal(bitcoinExp)).toNumber()

  // Add an output for our payment's destination address
  transactionBuilder.addOutput(to, totalSendingSatoshis);

  // If we need change, we'll need to add another output
  if (rest.comparedTo(1) == 1) {
    transactionBuilder.addOutput(from, rest.floor().toNumber());
  }

  let inputIndexCounter = 0;

  // Loop through all the utxos we want to spend and
  // attach all the information we'll need to add and
  // sign them.  Also give each utxo an index which 
  // will represent the utxo's order in the new
  // transaction
  let txInputs = utxo.utxos.map( (oneUtxo) => {
    return {
      index: inputIndexCounter++,
//      path: _.find(paymentAddresses, {cashAddress: oneUtxo.cashAddress})['BIP44DerivationPath'],
      txid: oneUtxo.txid,
      // This utxo's position in the previous transaction's output array
      vout: oneUtxo.vout,
      amountSatoshis: oneUtxo.satoshis,
      cashAddress: oneUtxo.cashAddress
    };
  });

  // Add those inputs
  for (let oneTxInput of txInputs) {
    // When adding inputs, we only care about each utxos position from the previous transaction
    transactionBuilder.addInput(oneTxInput.txid, oneTxInput.vout);
  }

  // Sign those inputs
  for (let oneTxInput of txInputs) {
    // Create an ECpair to sign this particular input from.  If we are sweeping
    // from a paper wallet, we'll use the `signingECpair` created earlier.
    // Otherwise, create a signing pair for this input from it's associated
    // PaymentAddress's derivationString.
    let inputSigningPair = signingECpair

    // When signing, we only care about making sure that BITBOX knows we are signing the right transaction.
    transactionBuilder.sign(oneTxInput.index, inputSigningPair, undefined, transactionBuilder.hashTypes.SIGHASH_ALL, oneTxInput.amountSatoshis);
  }

  // Now let's build it!
  let tx;
  try {
    tx = transactionBuilder.build();
  } catch (nope) {
    console.log('Cannot build transaction:', nope);
    throw nope;
  }
  return tx
}

const sendBitcoinCash = (amount, to, from, wif, fee) => {
  let addressWithPrefix;
  //https://gist.github.com/alwaysAn0n/953d4a20030eb57645b65af48d63df18
  if (to.split(":").length == 1){
    addressWithPrefix = "bitcoincash:"+to
  }
  else{
    addressWithPrefix = to
  }
  return constructTransaction(amount, addressWithPrefix, from, wif, fee).then(tx=>
    {
      return bitbox.RawTransactions.sendRawTransaction(tx.toHex())
    })


}
const getFees = (amount, to,from, wif) => {
  let tmptx;
  let feePerByte ;
  return fetch("https://bch-chain.api.btc.com/v3/block/latest").then(response => {
      return response.text();
    })
    .then(res => {
      try {
        tmptx = JSON.parse(res);
      } catch {
        throw new Error(`malformed json answer from the server:${res}`);
      }
      
      feePerByte = Decimal(tmptx.data.reward_fees).div(Decimal(tmptx.data.size))
      if(feePerByte.toNumber()<4)
      {
        feePerByte = Decimal("4")
      }
      return constructTransaction(amount, to, from, wif, "0.00000001").then(tx=>
        {
          return Decimal(tx.toHex().length/2).mul(feePerByte).floor().div(bitcoinExp).toString()
        })
    })
    

}

export default {
  getFees,
  sendBitcoinCash,
};
