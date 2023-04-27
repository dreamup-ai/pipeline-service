import { FastifyReply, FastifyRequest } from "fastify";
import Ajv from "ajv";
import { Pipeline, PipelineUpdate } from "../types";

const ajv = new Ajv();

export const validateSchema = async (
  request: FastifyRequest<{ Body: PipelineUpdate | Pipeline }>,
  reply: FastifyReply
) => {
  if (request.body.input_schema) {
    try {
      ajv.compile(request.body.input_schema);
    } catch (e: any) {
      reply
        .code(400)
        .send({ error: "input_schema must be a valid JSON Schema v7" });
    }
  }

  if (request.body.output_schema) {
    try {
      ajv.compile(request.body.output_schema);
    } catch (e: any) {
      reply
        .code(400)
        .send({ error: "output_schema must be a valid JSON Schema v7" });
    }
  }
};
