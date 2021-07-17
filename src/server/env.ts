import crypto from "crypto";

// TODO(user): Defaulting to non-null string is only for demonstration to start easily.
const API_JWT_SECRET =
  process.env.API_JWT_SECRET ?? crypto.randomBytes(32).toString("hex");
const API_USER_ID = process.env.API_USER_ID ?? "user";
const API_USER_PASS = process.env.API_USER_PASS ?? "pass";

export { API_JWT_SECRET, API_USER_ID, API_USER_PASS };
