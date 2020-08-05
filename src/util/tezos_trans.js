/**
 * @jest-environment node
 */
import crypto from "crypto";
//https://medium.com/@bakenrolls/sending-multiple-transactions-in-one-batch-using-tezos-rpc-6cab3a21f254
import Decimal from "decimal.js";
import { tezosExp } from "./tezos";
import CoinKey from "coinkey";
import { sha256 } from "js-sha256";
import bs58 from "bs58";
import Tezos from "../util/tezos";


import blake2 from "blakejs";
import { get } from "lodash";
let API_XTZ_TXS = "https://tezos-rpc.nodes.polychainlabs.com:443";

const VERBOSE = false

async function setApiXTZ(){
  res = await fetch("https://tezos-rpc.nodes.polychainlabs.com/chains/main/blocks/head/protocols",{})
  if (res.status != 200)
    API_XTZ_TXS = "https://mainnet.smartpy.io"
  VERBOSE && console.log(API_XTZ_TXS)
}
setApiXTZ()
  

let elliptic = require('elliptic');
let ec = new elliptic.ec('secp256k1');

const addMissingZeros = (st, si) => {
  let temp = st
  while(temp.length < si)
  {
    temp = "0" + temp
  }
  return temp
}

const getFees = async (to) => {
  if(!Tezos.isValidPublicAddress(to))
  {
    return "0.307";
  }
  VERBOSE && console.log("fee", API_XTZ_TXS+"/chains/main/blocks/head/context/contracts/"+to+"")
  response = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/context/contracts/"+to+"",{})
  
  restext = await response.text()
  try {
    jsonres = JSON.parse(restext);
  } catch {
    throw new Error(`malformed json answer from the server:${restext}`);
  }


  if (jsonres.balance == 0){
    return "0.307";
  }
  return "0.05";
}


const sendTezos = async (amount, to, from, wif, fee) => {
  computedFee = await getFees(to)
  let feeWithoutBurn ; 
  if (computedFee === "0.307"){
    if ( Decimal(fee).cmp(Decimal("0.257"))==-1){
      throw new Error(`minimal fee for acount creation is 0.257`);
    }
    feeWithoutBurn = Decimal(fee).sub(Decimal("0.257"))
  }
  else{
    feeWithoutBurn = Decimal(fee)
  }
  
  skAndCheck = bs58.decode(wif.split(":")[1])
  sk = skAndCheck.slice(4,36)
  
  // let keyPair = ec.genKeyPair();
  let keyPair = ec.keyFromPrivate(sk);
  let privKey = keyPair.getPrivate("hex");
  let pubKey = keyPair.getPublic();

  var len = pubKey.curve.p.byteLength();
  var x = pubKey.getX().toArray('be', len);
  
  

  pubkeybuf = Buffer([ 3, 254, 226, 86,  pubKey.getY().isEven() ? 0x02 : 0x03 ].concat(x))
  checksum = Buffer.from(
    sha256.digest(sha256.digest(pubkeybuf)).slice(0, 4)
  );
  pubkeyAndCheck = Buffer.concat([pubkeybuf,checksum])

  
  let pubkeyAndCheck58 = bs58.encode(pubkeyAndCheck)
  let hash ;
  let counter;
  let response = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/hash", {
    method: "GET",
    headers: {
    }
  })
  let jsonres = await response.json()
  hash = jsonres
  VERBOSE && console.log("hash", hash)
  response = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/context/contracts/"+from+"/manager_key",{})
  let revealed = await response.json()
  VERBOSE && console.log("revealed", revealed)
  response = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/context/contracts/"+from+"/counter",{})
  jsonres = await response.json()
  counter = jsonres
  VERBOSE && console.log("counter", counter)
  let counterp1 = (parseInt(counter)+1).toString()
  let counterp2 = (parseInt(counter)+2).toString()
  let opts;
  if (revealed ){
    opts = {"contents":[
    {
    "kind": "transaction",
    "amount": Decimal(amount).mul(tezosExp).toString(),
    "source": from,
    "destination": to,
    "storage_limit": "277",
    "gas_limit": "10600",
    "fee": feeWithoutBurn.mul(tezosExp).toString(),
    "counter": counterp1

    }
    ],
    "branch": hash
    }

  }
  else{
    opts = {"contents":[
    {
      kind: 'reveal',
      fee: "50000",
      counter: counterp1,
      public_key: pubkeyAndCheck58,
      source: from,
      gas_limit: '10600',
      storage_limit: '0',
    },
    
    {
    "kind": "transaction",
    "amount": Decimal(amount).mul(tezosExp).toString(),
    "source": from,
    "destination": to,
    "storage_limit": "277",
    "gas_limit": "10600",
    "fee": feeWithoutBurn.mul(tezosExp).toString(),
    "counter": counterp2

    }
    ],
    "branch": hash
    }

  }

  response = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/helpers/forge/operations", {
    method: "POST",
    headers: {
      "Cache-Control":  "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts)
  })
  restext = await response.text()
  try {
    jsonres = JSON.parse(restext);
  } catch {
    throw new Error(`malformed json answer from the server:${restext}`);
  }

  
  let operationhex = jsonres


  const hash_operationhex = blake2.blake2b(Buffer( "03"+operationhex,"hex"), "", 32);


  let signed = ec.sign(hash_operationhex, privKey, "hex", {canonical: true});

  const sigprefix = "0d7365133f"
  let hexsig = addMissingZeros(signed.r.toString("hex"),64) + addMissingZeros(signed.s.toString("hex"),64)
  signed = Buffer(sigprefix + hexsig , 'hex')
  checksum = Buffer.from(
    sha256.digest(sha256.digest(signed)).slice(0, 4)
  );
  signedAndCheck = Buffer.concat([signed,checksum])
  
  let sig58 = bs58.encode(signedAndCheck)
  res = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/protocols", {method: "GET", headers: {
      "Cache-Control":  "no-cache",
      "Content-Type": "application/json",
    }
  })
  
  protocols = await res.json()

  opts ["protocol"] = protocols.protocol;
  opts.signature = sig58
  res = await fetch(API_XTZ_TXS+"/chains/main/blocks/head/helpers/preapply/operations", {method: "POST", headers: {
    "Cache-Control":  "no-cache",
    "Content-Type": "application/json",
  },
  body: JSON.stringify([opts])
  })
  restext = await res.text()
  try {
    jsonres = JSON.parse(restext);
  } catch {
    throw new Error(`malformed json answer from the server:${restext}`);
  }
  let data =  JSON.stringify(operationhex + hexsig)
  res = await fetch(API_XTZ_TXS+"/injection/operation", {method: "POST", headers: {
    "Cache-Control":  "no-cache",
    "Content-Type": "application/json",
  },
  body: data
  })
  restext = await res.text()
  try {
    hashtx = JSON.parse(restext);
  } catch {
    throw new Error(`malformed json answer from the server:${restext}`);
  }
  return hashtx

}

export default {
  getFees,
  sendTezos
};
