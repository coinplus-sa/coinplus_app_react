import Litecoin from "./litecoin";

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
    valid: true,
  },
  {
    address: "1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg",
    valid: false,
  },
  {
    address: "13HJFyXMNaY4xRevxzTkGCpL6JTnaZwtqB",
    valid: false,
  },
  {
    address: "15UDAMYQFDwEohwHZQSPhUEfMntxqhRwyC",
    valid: false,
  },
  {
    address: "1JWhC25CxDpThSqSbiaxZcCuSD3W1kBUeU",
    valid: false,
  },
  {
    address: "1JWhCù%¨`$25CxDpThSqSbiaxZcCuSD3W1",
    valid: false,
  },
  {
    address: "",
    valid: false,
  },
].map(({ address, valid }) =>
  test(`Expect '${address}' to be ${
    valid ? "a valid" : "an invalid"
  } address`, () => {
    expect(Litecoin.isValidPublicAddress(address)).toBe(valid);
  })
);

// Tests: private key generation
const generateTest = (key1, key2, expectedWif, expectedPublicKey) => {
  test(`For keys ['${key1}', '${key2}'], expects:\nWIF = '${expectedWif}'\nPublic key = '${expectedPublicKey}'`, async () => {
    expect.assertions(2);
    const wif = await Litecoin.getWifLTC(key1, key2);
    const publicKey = Litecoin.getPublicKeyFromWif(wif);

    expect(wif).toEqual(expectedWif);
    expect(publicKey).toEqual(expectedPublicKey);
  });
};

generateTest(
  "BSqoaR4tBqLeP69XiEtiELE1Zs7BNg",
  "AvVJkTJTHkKkSW3nTWQdNT454E1qnS",
  "T3KjNNef8nkdkL98wnECxDpSawZpyGB9pLULYU5Z5rQUNuTVzwwb",
  "LLs788LkRF5o3VePbE16JN6iqWiZMMzpBt"
);
