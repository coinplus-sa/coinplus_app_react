// import { Buffer } from "safe-buffer";
import secrets from "secrets.js-grempe";
import bs58 from "bs58";

export const combine = (share1, share2) => {
  const share1hex = bs58.decode(share1).toString("hex");
  const share2hex = bs58.decode(share2).toString("hex");

  console.log("share1", share1, share1hex);
  console.log("share2", share2, share2hex);

  // Each share is a string in the format <bits><id><value>.
  // p28
  // id 7

  // p14 -> bits = 14 -> e
  // id 4 chars

  const formattedShare1 = "8" + "01" + share1hex;
  const formattedShare2 = "8" + "02" + share2hex;

  console.log("test 1", secrets.extractShareComponents(formattedShare1));
  console.log("test 2", secrets.extractShareComponents(formattedShare2));

  const secret = secrets.combine([formattedShare1, formattedShare2]);
  console.log("secret", secret);

  const bs58secret = bs58.encode(Buffer.from(secret, "hex"));
  console.log("bs58secret", bs58secret);

  return bs58secret;
};

export default combine;
