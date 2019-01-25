import Bitcoin from "./bitcoin";

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
    address: "1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg",
    valid: true,
  },
  {
    address: "13HJFyXMNaY4xRevxzTkGCpL6JTnaZwtqB",
    valid: true,
  },
  {
    address: "15UDAMYQFDwEohwHZQSPhUEfMntxqhRwyC",
    valid: true,
  },
  {
    address: "1JWhC25CxDpThSqSbiaxZcCuSD3W1kBUeU",
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
    expect(Bitcoin.isValidPublicAddress(address)).toBe(valid);
  })
);

// Tests: private key generation
const generateTest = (key1, key2, expectedWif, expectedPublicKey) => {
  test(`For keys ['${key1}', '${key2}'], expects:\nWIF = '${expectedWif}'\nPublic key = '${expectedPublicKey}'`, async () => {
    expect.assertions(2);
    const wif = await Bitcoin.getWIF(key1, key2);
    const publicKey = Bitcoin.getPublicKeyFromWif(wif);

    expect(wif).toEqual(expectedWif);
    expect(publicKey).toEqual(expectedPublicKey);
  });
};

generateTest(
  "qxknCqsD18GLvkV8FNrabuFicmbz",
  "G7DRagygVQzVmE",
  "Kxb1QrK7mFtGayzV2HvuvuoMgbPbCwmJdtPnK4kbcC3XBMXVQbV1",
  "1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg"
);

generateTest(
  "BH8bGpAr15UCcmifwwaa5xpazquX",
  "y7Qk6H8Vj7s8YR",
  "KxN9W22CsiquFpLkBLjzsh366BvQnKdEkumTv9jgB3FKHSwF2Zqy",
  "13HJFyXMNaY4xRevxzTkGCpL6JTnaZwtqB"
);

generateTest(
  "9K6PToqvqUJejbCnkFuBUn5BMkZX",
  "Vh5W2GDhAdWTPw",
  "L1S485xivNwoN8t93rprLfWNA77Egj2G8JJWY8GLWXJmi973Aqsp",
  "15UDAMYQFDwEohwHZQSPhUEfMntxqhRwyC"
);

generateTest(
  "rfYWVfczv8grJ6mB2NvaWjt22EB9",
  "RxaFe5tioF3z14",
  "L2eFh6gDsQEStWY9PjvKNnGEyTwKirQ3mHKh6HXLeieNFpWwFrFa",
  "1JWhC25CxDpThSqSbiaxZcCuSD3W1kBUeU"
);
