import scrypt from "react-native-scrypt";
import bigInt from "big-integer";

const N = bigInt(
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
  16
);

const computePrivateKeySec256k1 = async (secret1B58, secret2B58) => {
  const hashedSecret1 = await scrypt(secret1B58, [], 16384, 8, 8, 32);
  const hashedSecret2 = await scrypt(secret2B58, [], 16384, 8, 8, 32);

  const n1 = bigInt(hashedSecret1, 16);
  const n2 = bigInt(hashedSecret2, 16);
  const n0 = n1.add(n2).mod(N);

  return n0;
};

export default computePrivateKeySec256k1;
