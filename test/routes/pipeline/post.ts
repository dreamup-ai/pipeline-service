import { expect } from "chai";
import { clearTable, getServer, sign } from "../../util";
import { FastifyInstance } from "fastify";
import config from "../../../src/config";
import { createPipeline } from "../../../src/crud";

describe("POST /pipeline", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
  });

  it("returns 201 for a valid pipeline correctly authenticated", async () => {
    const payload = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      output_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    };

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });

    expect(response.statusCode).to.equal(201);
    expect(response.json()).to.deep.equal(payload);
  });

  it("returns 400 if the request is unsigned", async () => {
    const payload = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      output_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    };

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      payload,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Missing signature",
    });
  });

  it("returns 400 if the body is missing required fields", async () => {
    const payload = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    };

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "body must have required property 'output_schema'",
    });
  });

  it("returns 400 if the body contains invalid fields", async () => {
    const payload = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      output_schema: {
        type: "rollercoaster",
        writeMax: true,
      },
    };

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "output_schema must be a valid JSON Schema v7",
    });
  });

  it("returns 401 if the signature is invalid", async () => {
    const payload = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      output_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    };

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
      payload,
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid signature",
    });
  });

  it("returns 409 if the pipeline already exists", async () => {
    const pipeline = {
      id: "test-pipeline",
      name: "Test Pipeline",
      description: "A test pipeline",
      input_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      output_schema: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    };

    await createPipeline(pipeline, server.log);

    const response = await server.inject({
      method: "POST",
      url: "/pipeline",
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(pipeline)),
      },
      payload: pipeline,
    });

    expect(response.statusCode).to.equal(409);
    expect(response.json()).to.deep.equal({
      error: "Pipeline already exists",
    });
  });
});
