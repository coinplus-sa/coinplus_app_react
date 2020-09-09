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
  "0x8fbca7EF9d5A6fd5Eabc11c6041888F639274E65",
  "0x44ca80876859458BBc074E68461b7203C995cF85",
  "0xbD969305A2b66c48E192918c2F0fF702F0342900",
  "0x7DB57061b12ba1a59323c7050929fe5e30edb3A1",
].map(publicAddress =>
  test(`Expect ${publicAddress} to be a valid public address`, () => {
    expect(Ethereum.isValidPublicAddress(publicAddress)).toBe(true);
  })
);

[
  "0x8fbca7Ef9d5A6fd5Eabc11c6041888F639274E65",
  "44ca80876859458BBc074E68461b7203C995cF8523",
  "ethereum:0x8fbca7EF9d5A6fd5Eabc11c6041888F639274E65",
  "",
  false,
].map(publicAddress =>
  test(`Expect ${publicAddress} to not be a valid public address`, () => {
    expect(Ethereum.isValidPublicAddress(publicAddress)).toBe(false);
  })
);

// Tests: public key is derived from private key
[
  {
    publicKey: "0x8fbca7EF9d5A6fd5Eabc11c6041888F639274E65",
    privateKey:
      "e0010a25dd4b5df441c6fb291d686a4452243e76ba276f641b9e345554ada00e",
  },
  {
    publicKey: "0x44ca80876859458BBc074E68461b7203C995cF85",
    privateKey:
      "ffb63b9ed40c73dc270c1d9d29200d7bbdcaded246801fb7751dc7890b5884ea",
  },
  {
    publicKey: "0xbD969305A2b66c48E192918c2F0fF702F0342900",
    privateKey:
      "8895cc2bad2fca88ac3b866f2b30368ffac91199056f6afa0d841bf6ea61410f",
  },
  {
    publicKey: "0x7DB57061b12ba1a59323c7050929fe5e30edb3A1",
    privateKey:
      "c10db20826b4200868097f04471574005bdc93fa71af93926685a12266f61f1b",
  },
  {
    publicKey: "0xff517fd8B6a4Ba15E3eC5dC86963ea49452fE1C1",
    privateKey:
      "02eda266f31ebb927ba83e560577ea6615bf3d0bc234132a290e6f109728edab",
  },
].map(({ publicKey, privateKey }) =>
  test(`Expect ${publicKey} to be derived from ${privateKey}`, () => {
    expect(
      Ethereum.isPublicAddressDerivedFromPrivateKey(publicKey, privateKey)
    ).toBe(true);
  })
);

// Tests: private key generation
[
  {
    key1: "HG6j8hkDkkk8jhh7JLECNzM7xt9E",
    key2: "5cnTsFuxaX3PNY",
    expectedPrivateKey:
      "e0010a25dd4b5df441c6fb291d686a4452243e76ba276f641b9e345554ada00e",
  },
  {
    key1: "syUPVCCdSumjvLJr7kqvfrChgywS",
    key2: "FFFeeFXx5SdhTM",
    expectedPrivateKey:
      "ffb63b9ed40c73dc270c1d9d29200d7bbdcaded246801fb7751dc7890b5884ea",
  },
  {
    key1: "zuKgzKQuUd4j367MkicHh3JmMn88",
    key2: "ytuTkeeKDu4fGM",
    expectedPrivateKey:
      "8895cc2bad2fca88ac3b866f2b30368ffac91199056f6afa0d841bf6ea61410f",
  },
  {
    key1: "1V3v356jU4tEJQYcjeoUW5tFVXyW",
    key2: "RR3EoufJ5utQXf",
    expectedPrivateKey:
      "c10db20826b4200868097f04471574005bdc93fa71af93926685a12266f61f1b",
  },
  {
    key1: "JLaxbNLqpmnrDPE9A8m6rb718nt4",
    key2: "Q4qQMjdn4HeKQu",
    expectedPrivateKey:
      "02eda266f31ebb927ba83e560577ea6615bf3d0bc234132a290e6f109728edab",
  },
].map(({ key1, key2, expectedPrivateKey }) =>
  test(`For keys ['${key1}', '${key2}'], expects private key = '${expectedPrivateKey}'`, async () => {
    expect.assertions(1);
    const privateKey = await Ethereum.getPrivateKey(key1, key2);
    expect(privateKey).toEqual(expectedPrivateKey);
  })
);
