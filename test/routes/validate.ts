import { expect } from "chai";
import { clearTable, getServer, sign } from "../util";
import { FastifyInstance } from "fastify";
import { Pipeline } from "../../src/types";
import config from "../../src/config";
import { createPipeline } from "../../src/crud";

describe("POST /pipeline/:id/validate", () => {
  let server: FastifyInstance;
  let pipeline: Pipeline;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
    pipeline = (await createPipeline(
      {
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
      },
      server.log
    )) as Pipeline;
  });

  it("returns 200 if validation passes", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal({});
  });

  it("returns 307 if session cookie is invalid", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
      cookies: {
        [config.session.cookieName]: "invalid",
      },
      payload,
    });

    expect(response.statusCode).to.equal(307);
    expect(response.headers.location).to.equal(
      `${config.session.loginUrl}?redirect=/pipeline/${pipeline.id}/validate`
    );
  });

  it("returns 400 if validation fails", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: 1,
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });
    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      output: [
        {
          instancePath: "/test",
          schemaPath: "#/properties/test/type",
          keyword: "type",
          params: { type: "string" },
          message: "must be string",
        },
      ],
    });
  });

  it("returns 400 if no auth is provided", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
      payload,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({ error: "Missing signature" });
  });

  it("returns 401 if session token is invalid", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
      headers: {
        authorization: "Bearer invalid",
      },
      payload,
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid authorization token",
    });
  });

  it("returns 401 if signature is present and invalid", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/${pipeline.id}/validate`,
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

  it("returns 404 if pipeline does not exist", async () => {
    const payload = {
      input: {
        test: "test",
      },
      output: {
        test: "test",
      },
    };
    const response = await server.inject({
      method: "POST",
      url: `/pipeline/invalid/validate`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(payload)),
      },
      payload,
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({
      error: "Pipeline not found",
    });
  });
});
