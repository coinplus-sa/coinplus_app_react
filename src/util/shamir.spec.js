import { combine } from "./shamir";

test("shamir secret 1", () => {
  const shares = [
    [1, "9SZs9uuAdKbhNeKJRigZ1Rfq6ZA7"],
    [2, "gYxpJotQhGmQsP78LcUGdQ6yU8RR"],
    [3, "DfMmThsemDw8N7txFWFzFNY7qhcL"],
  ];

  const length = 28;

  const expected = "cLAv11uvZNRysuXUWptqPTEgiyyC";

  expect(combine(shares[0], shares[1], length)).toEqual(expected);
  expect(combine(shares[0], shares[2], length)).toEqual(expected);
  expect(combine(shares[1], shares[2], length)).toEqual(expected);
});

test("shamir secret 2", () => {
  const shares = [
    [1, "NvanZYpmZwnvra"],
    [2, "tvfQqyAqze6gJy"],
    [3, "Qvk38PWvRLQRjm"],
  ];
  const length = 14;

  const expected = "rvWAH8Uh9FVBRn";

  expect(combine(shares[0], shares[1], length)).toEqual(expected);
  expect(combine(shares[0], shares[2], length)).toEqual(expected);
  expect(combine(shares[1], shares[2], length)).toEqual(expected);
});
