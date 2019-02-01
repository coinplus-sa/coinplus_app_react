import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import BN from "bn.js";

const modulus14 = new BN("4875194084160298409672797", 10);
const modulus28 = new BN(
  "23767517358231570773047645414309870043308402671871",
  10
);

const b58strToBN = b58str => {
  const hex = bs58.decode(b58str).toString("hex");
  return new BN(hex, 16);
};

const BNToB58str = bn => {
  return bs58.encode(bn.toArrayLike(Buffer));
};

const lagrange = (shares, modulus) => {
  let s = new BN(0);
  shares.forEach((sharePi, pi) => {
    let factors = new BN(1);
    shares.forEach((sharePj, pj) => {
      if (pi !== pj) {
        const nom = new BN(0).sub(sharePj.x);
        const den = sharePi.x.sub(sharePj.x);
        const oneoverden = den.egcd(modulus).a;
        factors = factors.mul(nom).mul(oneoverden);
      }
    });
    s = s.add(sharePi.y.mul(factors));
  });

  return s.umod(modulus);
};

export const combine = ([index1, share1], [index2, share2], l = 14) => {
  const x1 = new BN(index1);
  const y1 = b58strToBN(share1);

  const x2 = new BN(index2);
  const y2 = b58strToBN(share2);

  let modulus = null;

  if (l === 14) modulus = modulus14;
  else if (l === 28) modulus = modulus28;

  const shares = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const secretInt = lagrange(shares, modulus);
  const b58Secret = BNToB58str(secretInt);
  return b58Secret;
};
