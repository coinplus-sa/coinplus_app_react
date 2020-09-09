import Decimal from "decimal.js";
import  Ethereum  from "./ethereum";
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/b338645706c24808a920fc58a9263a50`))
const API_ETH_TXS_CREATE = "https://api.blockcypher.com/v1/eth/main/txs/new";
const API_ETH_TXS_SEND = "https://api.blockcypher.com/v1/eth/main/txs/send";

const VERBOSE = false;

const estimateGasSimpleTransfer = (from, to)=>{
  let gasPrice;
  let chainId;
  let transactionCount;
  return web3.eth.getGasPrice().then(gp =>
    {
      gasPrice = gp;
      VERBOSE &&  console.log(gasPrice);
      return web3.eth.net.getId()
  }).then(chainIdres=>{
    chainId = chainIdres;
    return web3.eth.getTransactionCount(from)
    }).then(count => {
      transactionCount = count;
  let rawTransaction = {
    "from": from,
    "to": to,
    "value": "0",
    "gasPrice": gasPrice,
    "chainId": chainId.toString(),
    "gas": "100000",
    "count":Decimal(transactionCount).add(Decimal("1")).toString()
  };
    VERBOSE && console.log(rawTransaction)
    return  web3.eth.estimateGas(rawTransaction);
  }).then(eg=> {
    return  {estimatedGas:eg ,
      gasPrice, chainId, transactionCount}
 
  })

}

const getFees = (from, to) => {
  let gasPrice;
  let dest = from;
  if (Ethereum.isValidPublicAddress(to)){
    dest = to
  }
  return estimateGasSimpleTransfer(from, dest).then(({estimatedGas, gasPrice }) =>
    {
      VERBOSE && console.log("estimatedGas", estimatedGas)
      VERBOSE && console.log("gasPrice", gasPrice)
      return Decimal(gasPrice*estimatedGas).div(Ethereum.ethereumExp).toString()
    }
  )
};



const sendEther = (amount, to, from, privateKey, fee) => {
  let chainId;
  let estimatedGas;
  let gasPrice;
  return estimateGasSimpleTransfer(from, to).then(({estimatedGas, gasPrice, chainId, transactionCount }) =>
  {
    let gasPriceEntrered = web3.utils.toHex(Decimal(fee).mul(Ethereum.ethereumExp).div(Decimal(estimatedGas)).floor().toString())
  let rawTransaction = {
    "from": from,
    "to": to,
    "value": web3.utils.toHex(Decimal(amount).mul(Ethereum.ethereumExp).toString()),
    "gasPrice": gasPriceEntrered,
    "chainId": chainId,
    "gas": estimatedGas,
    "count":Decimal(transactionCount).add(Decimal("1")).toString()
  };
  VERBOSE && console.log(rawTransaction)
  return web3.eth.accounts.signTransaction(rawTransaction, privateKey)})
  .then(signedTransation =>{
    VERBOSE && console.log(signedTransation)
    return web3.eth.sendSignedTransaction(signedTransation.rawTransaction)
  }).then(transactionData => {
    return transactionData.transactionHash
  });
}
  
export default {
  getFees,
  sendEther,
};



