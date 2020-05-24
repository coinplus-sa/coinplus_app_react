import util from "ethereumjs-util";
import { Buffer } from "safe-buffer";
import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const getPrivateKey = async (secret1B58, secret2B58) => {
  const privkeyb256 = await computePrivateKeySec256k1(secret1B58, secret2B58);
  let privateKey = privkeyb256.toString(16);
  while (privateKey.length < 64) {
    privateKey = `0${privateKey}`;
  }
  return privateKey;
};

const getAddressKey = privateKey => {
  const privateKeyBuffer = Buffer.from(privateKey, "hex");
  const addressKey = util.bufferToHex(util.privateToAddress(privateKeyBuffer));
  return addressKey;
};

const isPublicAddressDerivedFromPrivateKey = (publicAddress, privateKey) => {
  if (!publicAddress || !privateKey) return false;
  return publicAddress.toLowerCase() === getAddressKey(privateKey);
};

const isValidPublicAddress = address => util.isValidChecksumAddress(address);

const getBalance = address => {
  return fetch(
    `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`
  ).then(function(response) {
    console.log(response)
    return response.json()}
  ).then(function(result) {
    console.log(result)
    return {
      finalBalance: result.final_balance * 0.000000000000000001,
      unconfirmedBalance: result.unconfirmed_balance * 0.000000000000000001,
    };
  });
};


export default {
  getPrivateKey,
  getAddressKey,
  getBalance,
  isValidPublicAddress,
  isPublicAddressDerivedFromPrivateKey,
};
