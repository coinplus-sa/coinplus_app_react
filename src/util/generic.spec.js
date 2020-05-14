import { computeSoloPro } from "./generic";

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

test("SOLO PRO 1", async () => {
  expect.assertions(2);

  const s1pro = {
    s14: "NvanZYpmZwnvra",
    s28: "9SZs9uuAdKbhNeKJRigZ1Rfq6ZA7",
    index: 1,
  };

  const s2pro = {
    s14: "tvfQqyAqze6gJy",
    s28: "gYxpJotQhGmQsP78LcUGdQ6yU8RR",
    index: 2,
  };

  const expectedSecret1 = "cLAv11uvZNRysuXUWptqPTEgiyyC";
  const expectedSecret2 = "rvWAH8Uh9FVBRn";

  const { secret1, secret2 } = await computeSoloPro({ s1pro, s2pro });

  expect(secret1).toEqual(expectedSecret1);
  expect(secret2).toEqual(expectedSecret2);
});

test("SOLO PRO 2", async () => {
  expect.assertions(2);

  const s1pro = {
    s14: "zuu7Gq3Lkh7xXU",
    s28: "sjYweMbyjyLroRQ66FhaDs3ZMjdH",
    index: 3,
  };

  const s2pro = {
    s14: "84cGqC21mLejrZ",
    s28: "Ntn59FTJNFqBVCXHjSfg785sWVmy",
    index: 2,
  };

  const expectedSecret1 = "PDEL939wcpoprkmh1pbsseAVp29k";
  const expectedSecret2 = "NN2bwuyMndiJZw";

  const { secret1, secret2 } = await computeSoloPro({ s1pro, s2pro });

  expect(secret1).toEqual(expectedSecret1);
  expect(secret2).toEqual(expectedSecret2);
});
