import scrypt from "react-native-scrypt";
import BN from "bn.js";

const N = new BN(
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
  16
);

const computePrivateKeySec256k1 = async (secret1B58, secret2B58) => {
  const hashedSecret1 = await scrypt(secret1B58, [], 16384, 8, 8, 32);
  const hashedSecret2 = await scrypt(secret2B58, [], 16384, 8, 8, 32);

  const n1 = new BN(hashedSecret1, 16);
  const n2 = new BN(hashedSecret2, 16);
  const n0 = n1.add(n2).mod(N);

  return n0;
};

export default computePrivateKeySec256k1;
