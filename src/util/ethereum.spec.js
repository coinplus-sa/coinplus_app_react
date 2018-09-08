import computePrivateKeyEthereum from "./ethereum";

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
  test(`computePrivateKeyEthereum('${key1}', '${key2}') == '${expectedPrivateKey}'`, async () => {
    expect.assertions(1);
    const privateKey = await computePrivateKeyEthereum(key1, key2);
    expect(privateKey).toEqual(expectedPrivateKey);
  });
};

generateTest(
  "HG6j8hkDkkk8jhh7JLECNzM7xt9E",
  "5cnTsFuxaX3PNY",
  "e0010a25dd4b5df441c6fb291d686a4452243e76ba276f641b9e345554ada00e"
);

generateTest(
  "syUPVCCdSumjvLJr7kqvfrChgywS",
  "FFFeeFXx5SdhTM",
  "ffb63b9ed40c73dc270c1d9d29200d7bbdcaded246801fb7751dc7890b5884ea"
);

generateTest(
  "zuKgzKQuUd4j367MkicHh3JmMn88",
  "ytuTkeeKDu4fGM",
  "8895cc2bad2fca88ac3b866f2b30368ffac91199056f6afa0d841bf6ea61410f"
);

generateTest(
  "1V3v356jU4tEJQYcjeoUW5tFVXyW",
  "RR3EoufJ5utQXf",
  "c10db20826b4200868097f04471574005bdc93fa71af93926685a12266f61f1b"
);
