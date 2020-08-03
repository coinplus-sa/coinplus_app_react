export default payload => {
  if (!payload) {
    throw new Error("Payload can't be empty");
  }

  if (typeof payload !== "string" && !(payload instanceof String)) {
    throw new Error("Payload must be a string");
  }

  /**
   * Payload is either a URL or the public address
   */

  // Remove trailing "/" if there's one
  const sanitizedUrl = payload.replace(/\/$/, "");

  // Extract last segment
  const lastSegment = sanitizedUrl.substr(sanitizedUrl.lastIndexOf("/") + 1);

  // SOLO pro data from QR and nfc ends with “?n=x” to identify the support.
  // Thus we need to split the last segment with "?"
  const splittedLastSegment = lastSegment.split("?");
  const address = splittedLastSegment[0];

  return address.trim();
};
