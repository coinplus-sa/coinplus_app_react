import { combine } from "./shamir";

test("shamir secret 1", () => {
  const secret = combine(
    "9SZs9uuAdKbhNeKJRigZ1Rfq6ZA7",
    "gYxpJotQhGmQsP78LcUGdQ6yU8RR",
    28
  );
  expect(secret).toEqual("cLAv11uvZNRysuXUWptqPTEgiyyC");
});

test("shamir secret 2", () => {
  const secret = combine("NvanZYpmZwnvra", "tvfQqyAqze6gJy", 14);
  expect(secret).toEqual("rvWAH8Uh9FVBRn");
});
