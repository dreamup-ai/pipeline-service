import { expect } from "chai";
import { clearTable, getServer, sign } from "../../util";
import { FastifyInstance } from "fastify";
import { createPipeline } from "../../../src/crud";
import { Pipeline } from "../../../src/types";
import config from "../../../src/config";

describe("DELETE /pipeline/:id", () => {
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
    const response = await server.inject({
      method: "DELETE",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({ url: `/pipeline/${pipeline.id}`, id: pipeline.id })
        ),
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal({ deleted: true, id: pipeline.id });
  });

  it("returns 401 for a valid pipeline incorrectly authenticated", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({ error: "Invalid signature" });
  });

  it("returns 404 for a pipeline that doesn't exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/pipeline/does-not-exist`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({
            url: `/pipeline/does-not-exist`,
            id: "does-not-exist",
          })
        ),
      },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({ error: "Pipeline not found" });
  });
});
