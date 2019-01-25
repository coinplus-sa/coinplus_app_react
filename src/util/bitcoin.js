import { sha256 } from "js-sha256";
import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import CoinKey from "coinkey";

import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const getWIF = async (secret1B58, secret2B58) => {
  const privkeyB256 = await computePrivateKeySec256k1(secret1B58, secret2B58);

  const toDigest = [128, ...privkeyB256.toArray(256), 1];
  const doublesha256 = sha256.digest(sha256.digest(toDigest));
  const finalPrivkeyB256 = [...toDigest, ...doublesha256.slice(0, 4)];

  const wif = bs58.encode(Buffer.from(finalPrivkeyB256));

  return wif;
};

const getPublicKeyFromWif = wif => {
  const ck = CoinKey.fromWif(wif);
  return ck.publicAddress;
};

const isValidPublicAddress = address => {
  if (!address) return false;

  try {
    const decoded = bs58.decode(address);
    if (decoded.length !== 25) return false;

    const checksum = decoded.slice(decoded.length - 4);
    const body = decoded.slice(0, decoded.length - 4);
    const goodChecksum = Buffer.from(
      sha256.digest(sha256.digest(body)).slice(0, 4)
    );

    return Buffer.compare(checksum, goodChecksum) === 0;
  } catch (e) {
    return false;
  }
};

export default {
  getWIF,
  getPublicKeyFromWif,
  isValidPublicAddress,
};
