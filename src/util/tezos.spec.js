import Tezos from "./tezos";

jest.mock("react-native-scrypt", () => ({
  __esModule: true,
  default: (secret, salt, N, r, p, dkLen) => {
    const scrypt = require("scrypt-async"); // eslint-disable-line

    return new Promise(resolve =>
      scrypt(
        secret,
        "",
        {
          N,
          r,
          p,
          dkLen,
          encoding: "hex",
        },
        derivedKey => {
          resolve(derivedKey);
        }
      )
    );
  },
}));

// Tests: public keys validation
[
  {
    address: "LLs788LkRF5o3VePbE16JN6iqWiZMMzpBt",
    valid: false,
  },
  {
    address: "bitcoincash:qzw8vcapp7re9th2z8kv00q8vcx8lya3q5r2mealmd",
    valid: false,
  },
  {
    address: "1JWhCù%¨`$25CxDpThSqSbiaxZcCuSD3W1",
    valid: false,
  },
  {
    address: "tz2VjZ3N6C2gcbVc9hxXjfUEjV32BWxyaprC",
    valid: true,
  },
  {
    address: "",
    valid: false,
  },
].map(({ address, valid }) =>
  test(`Expect '${address}' to be ${
    valid ? "a valid" : "an invalid"
  } address`, () => {
    expect(Tezos.isValidPublicAddress(address)).toBe(valid);
  })
);

// Tests: private key generation
const generateTest = (key1, key2, expectedWif, expectedPublicKey) => {
  test(`For keys ['${key1}', '${key2}'], expects:\nWIF = '${expectedWif}'\nPublic key = '${expectedPublicKey}'`, async () => {
    expect.assertions(2);
    const { bitcoin, tezos } = await Tezos.getWifXTZ(key1, key2);
    const publicKey = Tezos.getPublicKeyFromWif(bitcoin);

    expect(tezos).toEqual(expectedWif);
    expect(publicKey).toEqual(expectedPublicKey);
  });
};

generateTest(
  "AcTeuF3bdBRcnQdnGKF5jDR5ysSpyB",
  "gpiUK1Q4rAKS1MAHk6qGY8kcgCN2Gu",
  "unencrypted:spsk2ZzyievvU9pAQz6ss4NePUJwSQhJx94bQfSVezwvAKTEzvtnim",
  "tz2VjZ3N6C2gcbVc9hxXjfUEjV32BWxyaprC"
);
