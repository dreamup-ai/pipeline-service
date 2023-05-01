import { expect } from "chai";
import { clearTable, getServer, sign, issueSession } from "../../util";
import { FastifyInstance } from "fastify";
import { Pipeline } from "../../../src/types";
import { createPipeline } from "../../../src/crud";
import config from "../../../src/config";

describe("GET /pipeline/:id", () => {
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

  it("returns 200 with the pipeline in the body", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({ url: `/pipeline/${pipeline.id}`, id: pipeline.id })
        ),
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal(pipeline);
  });

  it("returns 302 for an invalid user session in a cookie", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}`,
      cookies: {
        [config.session.cookieName]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(302);
    expect(response.headers.location).to.equal(
      `${config.session.loginUrl}?redirect=/pipeline/${pipeline.id}`
    );
  });

  it("returns 400 if no session or signature is provided", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}`,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Missing signature",
    });
  });

  it("returns 401 for an invalid user session in a bearer token", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        authorization: `Bearer invalid`,
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid authorization token",
    });
  });

  it("returns 401 if there is no session and an invalid signature", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}`,
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid signature",
    });
  });

  it("returns 404 if the pipeline does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/invalid`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({ url: `/pipeline/invalid`, id: "invalid" })
        ),
      },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({
      error: "Pipeline not found",
    });
  });
});

describe("GET /pipeline/:id/input_schema", () => {
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

  it("returns 200 with the pipeline's input schema in the body", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/input_schema`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({
            url: `/pipeline/${pipeline.id}/input_schema`,
            id: pipeline.id,
          })
        ),
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal(pipeline.input_schema);
  });

  it("returns 302 for an invalid user session in a cookie", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/input_schema`,
      cookies: {
        [config.session.cookieName]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(302);
    expect(response.headers.location).to.equal(
      `${config.session.loginUrl}?redirect=/pipeline/${pipeline.id}/input_schema`
    );
  });

  it("returns 400 if no session or signature is provided", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/input_schema`,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Missing signature",
    });
  });

  it("returns 401 for an invalid user session in a bearer token", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/input_schema`,
      headers: {
        authorization: "Bearer invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid authorization token",
    });
  });

  it("returns 401 if there is no session and an invalid signature", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/input_schema`,
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid signature",
    });
  });

  it("returns 404 if the pipeline does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/invalid/input_schema`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({
            url: `/pipeline/invalid/input_schema`,
            id: "invalid",
          })
        ),
      },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({
      error: "Pipeline not found",
    });
  });
});

describe("GET /pipeline/:id/output_schema", () => {
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

  it("returns 200 with the pipeline's output schema in the body", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/output_schema`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({
            url: `/pipeline/${pipeline.id}/output_schema`,
            id: pipeline.id,
          })
        ),
      },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.json()).to.deep.equal(pipeline.output_schema);
  });

  it("returns 302 for an invalid user session in a cookie", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/output_schema`,
      cookies: {
        [config.session.cookieName]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(302);
    expect(response.headers.location).to.equal(
      `${config.session.loginUrl}?redirect=/pipeline/${pipeline.id}/output_schema`
    );
  });

  it("returns 400 if no session or signature is provided", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/output_schema`,
    });

    expect(response.statusCode).to.equal(400);
    expect(response.json()).to.deep.equal({
      error: "Missing signature",
    });
  });

  it("returns 401 for an invalid user session in a bearer token", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/output_schema`,
      headers: {
        authorization: "Bearer invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid authorization token",
    });
  });

  it("returns 401 if there is no session and an invalid signature", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/${pipeline.id}/output_schema`,
      headers: {
        [config.webhooks.signatureHeader]: "invalid",
      },
    });

    expect(response.statusCode).to.equal(401);
    expect(response.json()).to.deep.equal({
      error: "Invalid signature",
    });
  });

  it("returns 404 if the pipeline does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/pipeline/invalid/output_schema`,
      headers: {
        [config.webhooks.signatureHeader]: sign(
          JSON.stringify({
            url: `/pipeline/invalid/output_schema`,
            id: "invalid",
          })
        ),
      },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.json()).to.deep.equal({
      error: "Pipeline not found",
    });
  });
});
