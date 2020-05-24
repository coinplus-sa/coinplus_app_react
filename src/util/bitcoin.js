import { sha256 } from "js-sha256";
import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import CoinKey from "coinkey";

import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const getWif = async (secret1B58, secret2B58) => {
  const privkeyB256 = await computePrivateKeySec256k1(secret1B58, secret2B58);
  const formats = {
    bitcoin: { first: [128], compressed: true },
    litecoin: { first: [176], compressed: true },
    tezos: { first: [17, 162, 224, 201], compressed: false },
    bitcoincash: { first: [128], compressed: true },
  };
  // eslint-disable-next-line prefer-const
  let outputs = {};
  let toDigest;
  let doublesha256;
  let finalPrivkeyB256;
  Object.keys(formats).forEach(format => {
    if (formats[format].compressed) {
      toDigest = [...formats[format].first, ...privkeyB256.toArray(256), 1];
    } else {
      toDigest = [...formats[format].first, ...privkeyB256.toArray(256)];
    }
    doublesha256 = sha256.digest(sha256.digest(toDigest));
    finalPrivkeyB256 = [...toDigest, ...doublesha256.slice(0, 4)];

    outputs[format] = bs58.encode(Buffer.from(finalPrivkeyB256));
  });
  return outputs;
};

const getWifBTC = async (secret1B58, secret2B58) => {
  const { bitcoin } = await getWif(secret1B58, secret2B58);
  return bitcoin;
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
    if (decoded[0] !== 0x00) {
      return false;
    }
    return Buffer.compare(checksum, goodChecksum) === 0;
  } catch (e) {
    return false;
  }
};

const getBalance = address => {
  return fetch(
    `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
  ).then(function(response) {
    return response.json()}
  ).then(function(result) {
    return {
      finalBalance: result.final_balance * 0.00000001,
      unconfirmedBalance: result.unconfirmed_balance * 0.00000001,
    };
  });
};

export default {
  getWif,
  getWifBTC,
  getPublicKeyFromWif,
  isValidPublicAddress,
  getBalance,
};
