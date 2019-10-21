import Bitcoin from "./bitcoin";
import Ethereum from "./ethereum";
import { combine } from "./shamir";
import scrypt from 'scrypt-async'
import cryptojs from "crypto-js"
import BN from 'bn.js'

const bitcoinB58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var bitcoinB58charsValues = {}
for (var i in bitcoinB58chars) {
  bitcoinB58charsValues[bitcoinB58chars[i]] = parseInt(i)
}



const N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16, "be")

async function scryptProm (secrect) {
    const promise = new Promise((resolve, reject) => {
        scrypt(secrect, [], {N: 16384, r: 8, p: 8, dkLen: 32}, (res) => {
            resolve(res)
        })
    })
    return promise
}
function base58encode (value, length) {
  const b58chars = bitcoinB58chars
  var result = ''
  
  while (!value.isZero()) {
    var r = value.divmod(new BN(58))
    result = b58chars[r.mod] + result
    value = r.div
  }
  var inilen = result.length;
  for (var i = 0; i < length - inilen ; i++) {
    result = b58chars[0] + result
  }
  return result
}


export function verify_solo_check(string, size)
{
    var raw = string.slice(0, -size);
    var h = cryptojs.SHA256(cryptojs.SHA256(raw)).toString();
    var b = new BN(h, 16, "le");
    var b58 = new BN(58);
    var check = b.mod(b58.pow(new BN(size)));
    return base58encode(check, length=size) == string.slice(-size);
}


export const isValidAddress = (address, currency) => {
  if (currency === "btc") {
    return Bitcoin.isValidPublicAddress(address);
  }

  if (currency === "eth") {
    return Ethereum.isValidPublicAddress(address);
  }

  return false;
};

export const computeSoloPro = async ({
  s1pro,
  s2pro,
  currency = "btc",
} = {}) => {
  const s28 = combine([s1pro.index, s1pro.s28], [s2pro.index, s2pro.s28], 28);
  const s14 = combine([s1pro.index, s1pro.s14], [s2pro.index, s2pro.s14], 14);

  let privateKey = "";
  if (currency === "btc") {
    privateKey = await Bitcoin.getWIF(s28, s14);
  } else if (currency === "eth") {
    privateKey = await Ethereum.getPrivateKey(s28, s14);
  }

  return privateKey;
};

export default {
  isValidAddress,
  computeSoloPro,
};
