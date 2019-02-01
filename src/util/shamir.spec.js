import shamir from "./shamir";

test("shamir secret 1", () => {
  const secret = shamir(
    "9SZs9uuAdKbhNeKJRigZ1Rfq6ZA7",
    "gYxpJotQhGmQsP78LcUGdQ6yU8RR"
  );

  expect(secret).toEqual("cLAv11uvZNRysuXUWptqPTEgiyyC");
});

test("shamir secret 2", () => {
  const secret = shamir("NvanZYpmZwnvra", "tvfQqyAqze6gJy");

  expect(secret).toEqual("rvWAH8Uh9FVBRn");
});
