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

  // Return last segment
  return sanitizedUrl.substr(sanitizedUrl.lastIndexOf("/") + 1);
};
