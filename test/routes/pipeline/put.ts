import { expect } from "chai";
import { clearTable, getServer } from "../../util";
import { FastifyInstance } from "fastify";

describe("PUT /pipeline/:id", () => {
  let server: FastifyInstance;

  before(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    await clearTable();
  });

  it("returns 200 for a valid pipeline correctly authenticated", async () => {});

  it("returns 400 if the request is unsigned", async () => {});

  it("returns 400 if the body is missing required fields", async () => {});

  it("returns 400 if the body contains invalid fields", async () => {});

  it("returns 401 if the signature is invalid", async () => {});

  it("returns 404 if the pipeline does not exist", async () => {});
});
