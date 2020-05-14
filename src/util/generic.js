import cryptojs from "crypto-js";
import BN from "bn.js";
import Bitcoin from "./bitcoin";
import Litecoin from "./litecoin";
import Tezos from "./tezos";
import BitcoinCash from "./bitcoincash";
import Ethereum from "./ethereum";
import { combine } from "./shamir";

const bitcoinB58chars =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/* 
const bitcoinB58charsValues = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  A: 9,
  B: 10,
  C: 11,
  D: 12,
  E: 13,
  F: 14,
  G: 15,
  H: 16,
  J: 17,
  K: 18,
  L: 19,
  M: 20,
  N: 21,
  P: 22,
  Q: 23,
  R: 24,
  S: 25,
  T: 26,
  U: 27,
  V: 28,
  W: 29,
  X: 30,
  Y: 31,
  Z: 32,
  a: 33,
  b: 34,
  c: 35,
  d: 36,
  e: 37,
  f: 38,
  g: 39,
  h: 40,
  i: 41,
  j: 42,
  k: 43,
  m: 44,
  n: 45,
  o: 46,
  p: 47,
  q: 48,
  r: 49,
  s: 50,
  t: 51,
  u: 52,
  v: 53,
  w: 54,
  x: 55,
  y: 56,
  z: 57
}

*/

/*

const N = new BN(
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
  16,
  "be"
);
*/

/*
async function scryptProm(secrect) {
  const promise = new Promise((resolve, reject) => {
    scrypt(secrect, [], { N: 16384, r: 8, p: 8, dkLen: 32 }, res => {
      resolve(res);
    });
  });
  return promise;
}
*/

export function base58encode(valueArg, length) {
  const b58chars = bitcoinB58chars;
  let result = "";
  let value = valueArg;

  while (!value.isZero()) {
    const r = value.divmod(new BN(58));
    result = b58chars[r.mod] + result;
    value = r.div;
  }
  const inilen = result.length;
  for (let i = 0; i < length - inilen; i += 1) {
    result = b58chars[0] + result;
  }
  return result;
}

export function verifySoloCheck(string, size) {
  const raw = string.slice(0, -size);
  const h = cryptojs.SHA256(cryptojs.SHA256(raw)).toString();
  const b = new BN(h, 16, "le");
  const b58 = new BN(58);
  const check = b.mod(b58.pow(new BN(size)));
  return base58encode(check, size) === string.slice(-size);
}

export const isValidAddress = (address, currency) => {
  if (currency === "btc") {
    return Bitcoin.isValidPublicAddress(address);
  }
  if (currency === "ltc") {
    return Litecoin.isValidPublicAddress(address);
  }

  if (currency === "eth") {
    return Ethereum.isValidPublicAddress(address);
  }
  if (currency === "xtz") {
    return Tezos.isValidPublicAddress(address);
  }
  if (currency === "bch") {
    return BitcoinCash.isValidPublicAddress(address);
  }

  return false;
};

export const computeSoloPro = async ({ s1pro, s2pro } = {}) => {
  const s28 = combine([s1pro.index, s1pro.s28], [s2pro.index, s2pro.s28], 28);
  const s14 = combine([s1pro.index, s1pro.s14], [s2pro.index, s2pro.s14], 14);

  return { secret1: s28, secret2: s14 };
};

export function base256decode(bytestr) {
  let value = new BN(0);
  let leedingZeros = 0;
  let started = false;
  let b;
  if (bytestr.length > 0) {
    for (b = 0; b < bytestr.length; b += 1) {
      if (bytestr[b] === 0 && !started) {
        leedingZeros += 1;
      } else {
        started = true;
      }
      value = value.mul(new BN(256)).add(new BN(bytestr[b]));
    }
  }
  return { value, leedingZeros };
}

export default {
  isValidAddress,
  computeSoloPro,
  base58encode,
  base256decode,
};
