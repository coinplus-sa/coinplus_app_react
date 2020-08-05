import util from "ethereumjs-util";
import { Buffer } from "safe-buffer";
import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";
import Decimal from "decimal.js";

const ethereumExp = Decimal(10 ** 18);

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
const historyURL = "https://live.blockcypher.com/eth/address/";

const getBalance = address => {
  return fetch(
    `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`
  )
    .then(response => {
      return response.json();
    })
    .then(result => {
      return {
        finalBalance: Decimal(result.final_balance)
        .div(ethereumExp)
        .toString(),
        unconfirmedBalance: Decimal(result.unconfirmed_balance)
        .div(ethereumExp)
        .toString(),
      };
    });
};

export default {
  getPrivateKey,
  getAddressKey,
  getBalance,
  isValidPublicAddress,
  isPublicAddressDerivedFromPrivateKey,
  historyURL,
  ethereumExp
};
