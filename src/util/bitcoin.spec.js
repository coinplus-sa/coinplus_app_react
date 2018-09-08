import computePrivateKeyBitcoin from "./bitcoin";

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
          encoding: "hex"
        },
        derivedKey => {
          resolve(derivedKey);
        }
      )
    );
  }
}));

const generateTest = (key1, key2, expectedPrivateKey) => {
  test(`computePrivatekeyBitcoin('${key1}', '${key2}') == '${expectedPrivateKey}'`, async () => {
    expect.assertions(1);
    const privateKey = await computePrivateKeyBitcoin(key1, key2);
    expect(privateKey).toEqual(expectedPrivateKey);
  });
};

generateTest(
  "qxknCqsD18GLvkV8FNrabuFicmbz",
  "G7DRagygVQzVmE",
  "Kxb1QrK7mFtGayzV2HvuvuoMgbPbCwmJdtPnK4kbcC3XBMXVQbV1"
);

generateTest(
  "BH8bGpAr15UCcmifwwaa5xpazquX",
  "y7Qk6H8Vj7s8YR",
  "KxN9W22CsiquFpLkBLjzsh366BvQnKdEkumTv9jgB3FKHSwF2Zqy"
);

generateTest(
  "9K6PToqvqUJejbCnkFuBUn5BMkZX",
  "Vh5W2GDhAdWTPw",
  "L1S485xivNwoN8t93rprLfWNA77Egj2G8JJWY8GLWXJmi973Aqsp"
);

generateTest(
  "rfYWVfczv8grJ6mB2NvaWjt22EB9",
  "RxaFe5tioF3z14",
  "L2eFh6gDsQEStWY9PjvKNnGEyTwKirQ3mHKh6HXLeieNFpWwFrFa"
);

generateTest(
  "rfYWVfczv8grJ6mB2NvaWjt22EB9",
  "RxaFe5tioF3z14",
  "L2eFh6gDsQEStWY9PjvKNnGEyTwKirQ3mHKh6HXLeieNFpWwFrFa"
);

/*
assert compute_privatekey_ethereum("HG6j8hkDkkk8jhh7JLECNzM7xt9E","5cnTsFuxaX3PNY").lower() == b"e0010a25dd4b5df441c6fb291d686a4452243e76ba276f641b9e345554ada00e"
assert compute_privatekey_ethereum("syUPVCCdSumjvLJr7kqvfrChgywS","FFFeeFXx5SdhTM").lower() == b"ffb63b9ed40c73dc270c1d9d29200d7bbdcaded246801fb7751dc7890b5884ea"
assert compute_privatekey_ethereum("zuKgzKQuUd4j367MkicHh3JmMn88","ytuTkeeKDu4fGM").lower() == b"8895cc2bad2fca88ac3b866f2b30368ffac91199056f6afa0d841bf6ea61410f"
assert compute_privatekey_ethereum("1V3v356jU4tEJQYcjeoUW5tFVXyW","RR3EoufJ5utQXf").lower() == b"c10db20826b4200868097f04471574005bdc93fa71af93926685a12266f61f1b"
*/
