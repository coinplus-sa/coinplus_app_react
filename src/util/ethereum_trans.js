import Decimal from "decimal.js";
import  Ethereum  from "./ethereum";
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/b338645706c24808a920fc58a9263a50`))
const API_ETH_TXS_CREATE = "https://api.blockcypher.com/v1/eth/main/txs/new";
const API_ETH_TXS_SEND = "https://api.blockcypher.com/v1/eth/main/txs/send";

const estimateGasSimpleTransfer = (from)=>{
  let gasPrice;
  let chainId;
  let transactionCount;
  return web3.eth.getGasPrice().then(gp =>
    {
      gasPrice = gp;
      console.log(gasPrice);
      return web3.eth.net.getId()
  }).then(chainIdres=>{
    chainId = chainIdres;
    return web3.eth.getTransactionCount(from)
    }).then(count => {
      transactionCount = count;
  let rawTransaction = {
    "from": from,
    "to": from,
    "value": "0",
    "gasPrice": gasPrice,
    "chainId": chainId.toString(),
    "gas": "21000",
    "count":Decimal(transactionCount).add(Decimal("1")).toString()
  };
  console.log(rawTransaction)
//  return web3.eth.accounts.signTransaction(rawTransaction, privateKey)})
 // .then(signedTransation =>{
  //  console.log(signedTransation)
    return  web3.eth.estimateGas(rawTransaction);
  }).then(eg=> {
    return  {estimatedGas:eg ,
      gasPrice, chainId, transactionCount}
 
  })

}

const getFees = (from, privateKey) => {
  let gasPrice;
  return estimateGasSimpleTransfer(from).then(({estimatedGas, gasPrice }) =>
    {
      console.log("estimatedGas")
      console.log(estimatedGas)
      console.log("gasPrice")
      console.log(gasPrice)
      console.log(gasPrice*estimatedGas)
      return Decimal(gasPrice*estimatedGas).div(Ethereum.ethereumExp).toString()
    }
  )
};



const sendEther = (amount, to, from, privateKey, fee) => {
  let chainId;
  let estimatedGas;
  let gasPrice;
  return estimateGasSimpleTransfer(from).then(({estimatedGas, gasPrice, chainId, transactionCount }) =>
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
  console.log(rawTransaction)
  return web3.eth.accounts.signTransaction(rawTransaction, privateKey)})
  .then(signedTransation =>{
    console.log(signedTransation)
    return web3.eth.sendSignedTransaction(signedTransation.rawTransaction)
  }).then(transactionData => {
    return transactionData.transactionHash
  });
}
  
export default {
  getFees,
  sendEther,
};



