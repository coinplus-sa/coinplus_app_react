import Bitcoin from "./bitcoin";
import Ethereum from "./ethereum";

export const isValidAddress = (address, currency) => {
  if (currency === "btc") {
    return Bitcoin.isValidPublicAddress(address);
  }

  if (currency === "eth") {
    return Ethereum.isValidPublicAddress(address);
  }

  return false;
};

export default {
  isValidAddress,
};
