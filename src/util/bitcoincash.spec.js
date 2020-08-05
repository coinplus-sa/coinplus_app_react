import BitcoinCash from "./bitcoincash";

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
    valid: true,
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
    expect(BitcoinCash.isValidPublicAddress(address)).toBe(valid);
  })
);

// Tests: private key generation
const generateTest = (key1, key2, expectedWif, expectedPublicKey) => {
  test(`For keys ['${key1}', '${key2}'], expects:\nWIF = '${expectedWif}'\nPublic key = '${expectedPublicKey}'`, async () => {
    expect.assertions(2);
    const wif = await BitcoinCash.getWifBCH(key1, key2);
    const publicKey = BitcoinCash.getPublicKeyFromWif(wif);

    expect(wif).toEqual(expectedWif);
    expect(publicKey).toEqual(expectedPublicKey);
  });
};

generateTest(
  "3zAB5YKMkuPorF8wer9jefAnYAqXsB",
  "QEue2CupEj49kYbUVETs5K5UGkSUdc",
  "L41oJHBFdeGEu9jF1g7yxEn5iYFo3GSxU5cFwNPM8xerRZ6qaCQn",
  "bitcoincash:qzw8vcapp7re9th2z8kv00q8vcx8lya3q5r2mealmd"
);



[
  {address: "bitcoincash:qzw8vcapp7re9th2z8kv00q8vcx8lya3q5r2mealmd", valid:true},
  {address: "qzw8vcapp7re9th2z8kv00q8vcx8lya3q5r2mealmd", valid:true},
  {address: "bchtest:qzw8vcapp7re9th2z8kv00q8vcx8lya3q5r2mealmd", valid:false},
].map(({ address, valid }) =>
  test(`Expect '${address}' to be ${
    valid ? "a valid" : "an invalid"
  } address`, () => {
    expect(BitcoinCash.isValidPublicAddress(address)).toBe(valid);
  })
);

