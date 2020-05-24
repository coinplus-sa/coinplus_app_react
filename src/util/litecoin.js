import { sha256 } from "js-sha256";
import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import CoinKey from "coinkey";

import Bitcoin from "./bitcoin";

const getWifLTC = async (secret1B58, secret2B58) => {
  const { litecoin } = await Bitcoin.getWif(secret1B58, secret2B58);
  return litecoin;
};

const getPublicKeyFromWif = wif => {
  const ck = CoinKey.fromWif(wif, {
    public: 0x30,
    private: 0xb0,
  });
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
    if (decoded[0] !== 0x30) {
      return false;
    }
    return Buffer.compare(checksum, goodChecksum) === 0;
  } catch (e) {
    return false;
  }
};

const getBalance = address => {
  return fetch(
    `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`
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
  getWifLTC,
  getBalance,
  getPublicKeyFromWif,
  isValidPublicAddress,
};
