import { sha256 } from "js-sha256";
import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import CoinKey from "coinkey";
import blake2 from "blakejs";
import crypto from "crypto";
import { base58encode, base256decode } from "./generic";

import Bitcoin from "./bitcoin";

const getWifXTZ = async (secret1B58, secret2B58) => {
  const { bitcoin, tezos } = await Bitcoin.getWif(secret1B58, secret2B58);
  return { tezos: `unencrypted:${tezos}`, bitcoin };
};

const getPublicKeyFromWif = wif => {
  const ck = CoinKey.fromWif(wif);
  const pbuf = new Uint8Array(23);
  const addressB256 = new Uint8Array(27);
  const puKeyHash = blake2.blake2b(new Uint8Array(ck.publicKey), "", 20);
  pbuf.set([6, 161, 161], 0);
  pbuf.set(puKeyHash, 3);
  const sha2 = crypto
    .createHash("sha256")
    .update(
      crypto
        .createHash("sha256")
        .update(pbuf)
        .digest()
    )
    .digest();
  addressB256.set(pbuf, 0);
  addressB256.set(sha2.slice(0, 4), 23);
  const num = base256decode(addressB256);
  return base58encode(num.value, num.leeding_zeros);
};

const isValidPublicAddress = address => {
  if (!address) return false;
  try {
    const decoded = bs58.decode(address);
    const checksum = decoded.slice(decoded.length - 4);
    const body = decoded.slice(0, decoded.length - 4);
    const goodChecksum = Buffer.from(
      sha256.digest(sha256.digest(body)).slice(0, 4)
    );
    if (decoded[0] !== 6) {
      return false;
    }
    if (decoded[1] !== 161) {
      return false;
    }
    if (decoded[2] !== 159 && decoded[2] !== 161 && decoded[2] !== 164) {
      return false;
    }
    return Buffer.compare(checksum, goodChecksum) === 0;
  } catch (e) {
    return false;
  }
};
export default {
  getWifXTZ,
  getPublicKeyFromWif,
  isValidPublicAddress,
};
