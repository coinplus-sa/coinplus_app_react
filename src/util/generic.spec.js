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

test("SOLO PRO BTC", async () => {
  expect.assertions(1);

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

  const expectedPrivateKey =
    "L2xR49aiBRAsQvCA8Zuj39Ge7y5bwXFsPsGjEm14SuSB5NuMSTha";

  const privateKey = await computeSoloPro({ s1pro, s2pro, currency: "btc" });

  expect(privateKey).toEqual(expectedPrivateKey);
});

test("SOLO PRO ETH", async () => {
  expect.assertions(1);

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

  const expectedPrivateKey =
    "3aeba09074bf148f87f4aa69628698265877b4e929837d6fa59645dc7b05138b";

  const privateKey = await computeSoloPro({ s1pro, s2pro, currency: "eth" });

  expect(privateKey).toEqual(expectedPrivateKey);
});
