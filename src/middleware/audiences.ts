import config from "../config";
import { makeSessionValidator } from "./validate-session";
import { makeSourceValidator } from "./validate-source";

export const dreamupInternal = makeSourceValidator(
  config.webhooks.publicKey,
  config.webhooks.signatureHeader
);

export const dreamupUserSession = async () => {
  const key = await config.session.publicKey();
  return makeSessionValidator(key);
};
