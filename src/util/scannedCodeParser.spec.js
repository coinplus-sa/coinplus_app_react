import parse from "./scannedCodeParser";

/**
 * While scanning a SOLO for public address, the encoded data varies from a SOLO generation to another:
 * - 1st gen: raw public address
 * - 2nd gen: contains an url with the address as last segment ex: https://air.coinplus.com/{currency}/{address}
 */

test("should parse 1st gen data (raw public address)", () => {
  expect(parse("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg")).toBe(
    "1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg"
  );
});

test("should parse 2nd gen data (https://air.coinplus.com/{currency}/{address})", () => {
  expect(
    parse("https://air.coinplus.com/btc/1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg")
  ).toBe("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg");
});

test("should parse 2nd gen data2 (https://air.coinplus.com/{currency}/{address})", () => {
  expect(
    parse("https://air.coinplus.com/ltc/LLs788LkRF5o3VePbE16JN6iqWiZMMzpBt")
  ).toBe("LLs788LkRF5o3VePbE16JN6iqWiZMMzpBt");
});

test("should parse 2nd gen data with trailing slash (https://air.coinplus.com/{currency}/{address})/", () => {
  expect(
    parse("https://air.coinplus.com/btc/1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg/")
  ).toBe("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg");
});

test("should parse SOLO pro data (https://air.coinplus.com/{currency}/{address}?n={x})", () => {
  expect(
    parse("https://air.coinplus.com/btc/1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg?n=2")
  ).toBe("1AJyJhYJJfvb1ytwL45XxLePGnGihjXtyg");
});

test("should throw if payload is empty", () => {
  expect(() => parse()).toThrow("Payload can't be empty");
});

test("should throw if payload is not a string", () => {
  expect(() => parse(42)).toThrow("Payload must be a string");
});
