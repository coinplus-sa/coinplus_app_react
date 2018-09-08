import computePrivateKeySec256k1 from "./computePrivateKeySec256k1";

const computePrivateKeyEthereum = async (secret1B58, secret2B58) => {
  const privkeyb256 = await computePrivateKeySec256k1(secret1B58, secret2B58);
  return privkeyb256.toString(16);
};

export default computePrivateKeyEthereum;
