const reg = /https:\/\/air\.coinplus\.com\/[a-zA-Z]+\/([a-zA-Z0-9]+)/i;

export default payload => {
  if (!payload) {
    throw new Error("Payload can't be empty");
  }

  if (typeof payload !== "string" && !(payload instanceof String)) {
    throw new Error("Payload must be a string");
  }

  const matches = payload.match(reg);

  // If the payload doesn't match the regex, then return the payload (1st gen)
  if (!matches) return payload;

  // Otherwise, extract the address from the URL (2nd gen)
  return matches[1];
};
