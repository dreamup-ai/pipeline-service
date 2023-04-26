import crypto from "crypto";
import assert from "assert";
import fs from "fs";

const {
  AWS_REGION,
  AWS_DEFAULT_REGION = "us-east-1",
  DYNAMODB_ENDPOINT,
  PIPELINE_TABLE,
  PORT = "3000",
  HOST = "localhost",
  PUBLIC_URL = "http://localhost:3000",
  WEBHOOK_PUBLIC_KEY_PATH,
  WEBHOOK_PRIVATE_KEY_PATH,
  WEBHOOK_SIG_HEADER = "x-dreamup-signature",
  DREAMUP_SESSION_COOKIE_NAME = "dreamup_session",
  SESSION_PUBLIC_KEY_URL,
} = process.env;

assert(PIPELINE_TABLE, "PIPELINE_TABLE is required");
assert(WEBHOOK_PUBLIC_KEY_PATH, "WEBHOOK_PUBLIC_KEY_PATH is required");
assert(WEBHOOK_PRIVATE_KEY_PATH, "WEBHOOK_PRIVATE_KEY_PATH is required");
assert(SESSION_PUBLIC_KEY_URL, "SESSION_PUBLIC_KEY_URL is required");

const rawWebhookPublicKey = fs.readFileSync(WEBHOOK_PUBLIC_KEY_PATH, "utf8");
const webhookPublicKey = crypto.createPublicKey(rawWebhookPublicKey);
const rawWebhookPrivateKey = fs.readFileSync(WEBHOOK_PRIVATE_KEY_PATH, "utf8");
const webhookPrivateKey = crypto.createPrivateKey(rawWebhookPrivateKey);

type config = {
  aws: {
    region: string;
    endpoints: {
      dynamodb: string | undefined;
    };
  };
  db: {
    pipelineTable: string;
  };
  server: {
    port: number;
    host: string;
    publicUrl: string;
  };
  webhooks: {
    events: {
      [x: string]: string[];
    };
    publicKey: crypto.KeyObject;
    privateKey: crypto.KeyObject;
    signatureHeader: string;
  };
  session: {
    publicKey: () => Promise<crypto.KeyObject>;
    cookieName: string;
  };
};

let sessionKey: crypto.KeyObject | undefined;

const config: config = {
  aws: {
    region: AWS_REGION || AWS_DEFAULT_REGION,
    endpoints: {
      dynamodb: DYNAMODB_ENDPOINT,
    },
  },
  db: {
    pipelineTable: PIPELINE_TABLE,
  },
  server: {
    port: parseInt(PORT, 10),
    host: HOST,
    publicUrl: PUBLIC_URL,
  },
  webhooks: {
    events: {},
    publicKey: webhookPublicKey,
    privateKey: webhookPrivateKey,
    signatureHeader: WEBHOOK_SIG_HEADER,
  },
  session: {
    publicKey: async () => {
      if (!sessionKey) {
        // This is a JWK endpoint, so we need to fetch the key from the URL
        const res = await fetch(SESSION_PUBLIC_KEY_URL);
        const jwk = await res.json();
        sessionKey = crypto.createPublicKey(jwk);
      }
      return sessionKey;
    },
    cookieName: DREAMUP_SESSION_COOKIE_NAME,
  },
};

const pipelineCreateHooks = Object.keys(process.env)
  .filter((x) => x.startsWith("WEBHOOK_PIPELINE_CREATE") && process.env[x])
  .map((x) => process.env[x]) as string[];
if (pipelineCreateHooks.length > 0) {
  config.webhooks.events["pipeline.create"] = pipelineCreateHooks;
}

const pipelineUpdateHooks = Object.keys(process.env)
  .filter((x) => x.startsWith("WEBHOOK_PIPELINE_UPDATE") && process.env[x])
  .map((x) => process.env[x]) as string[];
if (pipelineUpdateHooks.length > 0) {
  config.webhooks.events["pipeline.update"] = pipelineUpdateHooks;
}

const pipelineDeleteHooks = Object.keys(process.env)
  .filter((x) => x.startsWith("WEBHOOK_PIPELINE_DELETE") && process.env[x])
  .map((x) => process.env[x]) as string[];
if (pipelineDeleteHooks.length > 0) {
  config.webhooks.events["pipeline.delete"] = pipelineDeleteHooks;
}

export default config;
