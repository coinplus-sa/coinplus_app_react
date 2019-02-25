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

export default {
  getPrivateKey,
  getAddressKey,
  isValidPublicAddress,
  isPublicAddressDerivedFromPrivateKey,
};
