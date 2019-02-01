import Bitcoin from "./bitcoin";
import Ethereum from "./ethereum";
import { combine } from "./shamir";

export const isValidAddress = (address, currency) => {
  if (currency === "btc") {
    return Bitcoin.isValidPublicAddress(address);
  }

  if (currency === "eth") {
    return Ethereum.isValidPublicAddress(address);
  }

  return false;
};

export const computeSoloPro = async ({
  s1pro,
  s2pro,
  currency = "btc",
} = {}) => {
  const s28 = combine([s1pro.index, s1pro.s28], [s2pro.index, s2pro.s28], 28);
  const s14 = combine([s1pro.index, s1pro.s14], [s2pro.index, s2pro.s14], 14);

  let privateKey = "";
  if (currency === "btc") {
    privateKey = await Bitcoin.getWIF(s28, s14);
  } else if (currency === "eth") {
    privateKey = await Ethereum.getPrivateKey(s28, s14);
  }

  return privateKey;
};

export default {
  isValidAddress,
  computeSoloPro,
};
