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

export const either =
  (a: any, b: any) => (request: any, reply: any, done: any) => {
    a(request, reply, (err: any) => {
      if (err) {
        b(request, reply, done);
      } else {
        done();
      }
    });
  };
