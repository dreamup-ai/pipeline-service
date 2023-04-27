import { expect } from "chai";
import { clearTable, getServer } from "../../util";
import { FastifyInstance } from "fastify";

describe("GET /pipeline/:id", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
  });

  it("returns 200 with the pipeline in the body", async () => {});

  it("returns 302 for an invalid user session in a cookie", async () => {});

  it("returns 400 if no session or signature is provided", async () => {});

  it("returns 401 for an invalid user session in a bearer token", async () => {});

  it("returns 401 if there is no session and an invalid signature", async () => {});

  it("returns 404 if the pipeline does not exist", async () => {});
});

describe("GET /pipeline/:id/input_schema", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
  });

  it("returns 200 with the pipeline's input schema in the body", async () => {});

  it("returns 302 for an invalid user session in a cookie", async () => {});

  it("returns 400 if no session or signature is provided", async () => {});

  it("returns 401 for an invalid user session in a bearer token", async () => {});

  it("returns 401 if there is no session and an invalid signature", async () => {});

  it("returns 404 if the pipeline does not exist", async () => {});
});

describe("GET /pipeline/:id/output_schema", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
  });

  it("returns 200 with the pipeline's output schema in the body", async () => {});

  it("returns 302 for an invalid user session in a cookie", async () => {});

  it("returns 400 if no session or signature is provided", async () => {});

  it("returns 401 for an invalid user session in a bearer token", async () => {});

  it("returns 401 if there is no session and an invalid signature", async () => {});

  it("returns 404 if the pipeline does not exist", async () => {});
});
