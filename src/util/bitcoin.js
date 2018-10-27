import { sha256 } from "js-sha256";
import bs58 from "bs58";
import CoinKey from "coinkey";

import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const getWIF = async (secret1B58, secret2B58) => {
  const privkeyb256 = await computePrivateKeySec256k1(secret1B58, secret2B58);

  const toDigest = [128, ...privkeyb256.toArray(256).value, 1];
  const doublesha256 = sha256.digest(sha256.digest(toDigest));
  const privkeyB256 = [...toDigest, ...doublesha256.slice(0, 4)];

  const wif = bs58.encode(privkeyB256);

  return wif;
};

const getPublicKeyFromWif = wif => {
  const ck = CoinKey.fromWif(wif);
  return ck.publicAddress;
};

export default {
  getWIF,
  getPublicKeyFromWif
};
