import Ethereum from "./ethereum";

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

const generateTest = (key1, key2, expectedPrivateKey, expectedAddressKey) => {
  test(`For keys ['${key1}', '${key2}'], expects:\nPrivate key = '${expectedPrivateKey}'\nAddress key = '${expectedAddressKey}'`, async () => {
    expect.assertions(2);
    const privateKey = await Ethereum.getPrivateKey(key1, key2);
    const addressKey = Ethereum.getAddressKey(privateKey);

    expect(privateKey).toEqual(expectedPrivateKey);
    expect(addressKey).toEqual(expectedAddressKey);
  });
};

generateTest(
  "HG6j8hkDkkk8jhh7JLECNzM7xt9E",
  "5cnTsFuxaX3PNY",
  "e0010a25dd4b5df441c6fb291d686a4452243e76ba276f641b9e345554ada00e",
  "0x8fbca7ef9d5a6fd5eabc11c6041888f639274e65"
);

generateTest(
  "syUPVCCdSumjvLJr7kqvfrChgywS",
  "FFFeeFXx5SdhTM",
  "ffb63b9ed40c73dc270c1d9d29200d7bbdcaded246801fb7751dc7890b5884ea",
  "0x44ca80876859458bbc074e68461b7203c995cf85"
);

generateTest(
  "zuKgzKQuUd4j367MkicHh3JmMn88",
  "ytuTkeeKDu4fGM",
  "8895cc2bad2fca88ac3b866f2b30368ffac91199056f6afa0d841bf6ea61410f",
  "0xbd969305a2b66c48e192918c2f0ff702f0342900"
);

generateTest(
  "1V3v356jU4tEJQYcjeoUW5tFVXyW",
  "RR3EoufJ5utQXf",
  "c10db20826b4200868097f04471574005bdc93fa71af93926685a12266f61f1b",
  "0x7db57061b12ba1a59323c7050929fe5e30edb3a1"
);
