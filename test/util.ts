import crypto from "node:crypto";
import { Cache } from "dynamo-tools";
import { build } from "../src/server";
import { FastifyInstance } from "fastify";
import config from "../src/config";
import jwt from "jsonwebtoken";
import sinon from "sinon";

const cache = new Cache({
  region: config.aws.region,
  endpoint: config.aws.endpoints.dynamodb,
});

const sandbox = sinon.createSandbox();

import { createTable, deleteTable } from "../init-local-dynamo";
export { createTable, deleteTable };

export const clearTable = async () => {
  await cache.deleteAll({ table: config.db.pipelineTable });
};

export function sign(
  payload: string,
  privateKey: crypto.KeyObject = config.webhooks.privateKey
) {
  const signature = crypto.sign("sha256", Buffer.from(payload), privateKey);
  return signature.toString("base64");
}

let server: FastifyInstance;
export const getServer = async () => {
  if (!server) {
    server = await build({ logger: false });
  }
  return server;
};

export const issueSession = (userId: string, sessionId: string) => {
  const token = jwt.sign(
    {
      userId,
      sessionId,
    },
    config.webhooks.privateKey,
    {
      expiresIn: "24h",
      algorithm: "RS256",
    }
  );
  return token;
};

before(async () => {
  try {
    await createTable();
  } catch (e) {
    // ignore
  }
  sandbox.restore();

  // For convenience we're just re-using the other key pair we use for testing.
  sandbox.stub(config.session, "publicKey").resolves(config.webhooks.publicKey);
});

after(async () => {
  await deleteTable();
  sandbox.restore();
});
