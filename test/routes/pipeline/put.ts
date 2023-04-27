import { expect } from "chai";
import { clearTable, getServer, sign } from "../../util";
import { FastifyInstance } from "fastify";
import config from "../../../src/config";
import { createPipeline, deletePipelineById } from "../../../src/crud";
import { Pipeline } from "../../../src/types";

describe("PUT /pipeline/:id", () => {
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

  it("returns 200 for a valid pipeline correctly authenticated", async () => {
    const update = {
      description: "A test pipeline, updated",
    };

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(update)),
      },
      payload: update,
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal({ ...pipeline, ...update });
  });

  it("returns 400 if the request is unsigned", async () => {
    const update = {
      description: "A test pipeline, updated",
    };

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      payload: update,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Missing signature",
    });
  });

  it("returns 400 if the body is missing required fields", async () => {
    const update = {};

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(update)),
      },
      payload: update,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Body must include at least one field to update",
    });
  });

  it("ignores invalid fields", async () => {
    const update = {
      invalid: "field",
    };

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(update)),
      },
      payload: update,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Body must include at least one field to update",
    });
  });

  it("returns 401 if the signature is invalid", async () => {
    const update = {
      description: "A test pipeline, updated",
    };

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
      payload: update,
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid signature",
    });
  });

  it("returns 404 if the pipeline does not exist", async () => {
    await deletePipelineById(pipeline.id!, server.log);

    const update = {
      description: "A test pipeline, updated",
    };

    const response = await server.inject({
      method: "PUT",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(JSON.stringify(update)),
      },
      payload: update,
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({
      error: "Pipeline not found",
    });
  });
});
