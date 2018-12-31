import parse from "./nfcParser";

/**
 * While scanning a SOLO for public address, the encoded data varies from a SOLO generation to another:
 * - 1st gen: raw public address
 * - 2nd gen: contains an url with the address as last segment ex: https://air.coinplus.com/{currency}/{address}
 */

test("should parse 1st gen NFC data (raw public address)", () => {
  expect(parse("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg")).toBe(
    "1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg"
  );
});

test("should parse 2nd gen NFC data (https://air.coinplus.com/{currency}/{address})", () => {
  expect(
    parse("https://air.coinplus.com/btc/1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg")
  ).toBe("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg");
});

test("should throw if payload is empty", () => {
  expect(() => parse()).toThrowError("Payload can't be empty");
});

test("should throw if payload is not a string", () => {
  expect(() => parse(42)).toThrowError("Payload must be a string");
});
