import crypto from "node:crypto";
import { Cache } from "dynamo-tools";
import { build } from "../src/server";
import { FastifyInstance } from "fastify";
import config from "../src/config";

const cache = new Cache({
  region: config.aws.region,
  endpoint: config.aws.endpoints.dynamodb,
});

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

before(async () => {
  try {
    await createTable();
  } catch (e) {
    // ignore
  }
});

after(async () => {
  await deleteTable();
});
