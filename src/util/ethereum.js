import util from "ethereumjs-util";
import { Buffer } from "safe-buffer";
import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const getPrivateKey = async (secret1B58, secret2B58) => {
  const privkeyb256 = await computePrivateKeySec256k1(secret1B58, secret2B58);
  const privateKey = privkeyb256.toString(16);

  return privateKey;
};

const getAddressKey = privateKey => {
  const privateKeyBuffer = Buffer.from(privateKey, "hex");
  const addressKey = util.bufferToHex(util.privateToAddress(privateKeyBuffer));

  return addressKey;
};

export default {
  getPrivateKey,
  getAddressKey,
};
