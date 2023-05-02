import { FastifyInstance } from "fastify";
import {
  ErrorResponse,
  errorResponseSchema,
  IdParam,
  idParamSchema,
  PipelineUpdate,
  SignatureHeader,
  signatureHeaderSchema,
  Validation,
  validationSchema,
} from "../types";
import {
  either,
  dreamupUserSession,
  dreamupInternal,
} from "../middleware/audiences";
import {
  getPipelineById,
  getPipelineInputSchemaById,
  getPipelineOutputSchemaById,
} from "../crud";
import Ajv from "ajv";

const ajv = new Ajv();

const routes = (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.post<{
    Params: IdParam;
    Body: { input?: any; output?: any };
    Response: Validation | ErrorResponse;
  }>(
    "/pipeline/:id/validate",
    {
      schema: {
        params: idParamSchema,
        body: {
          type: "object",
          properties: {
            input: {
              type: "object",
            },
            output: {
              type: "object",
            },
          },
        },
        headers: signatureHeaderSchema,
        response: {
          200: validationSchema,
          404: errorResponseSchema,
        },
      },
      preValidation: [either(dreamupUserSession, dreamupInternal)],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { body } = request;
      if (!body.input && !body.output) {
        reply.code(400).send({ error: "Must provide input or output" });
      }
      let pipeline: PipelineUpdate | null = null;
      if (body.input && body.output) {
        pipeline = await getPipelineById(id);
      } else if (body.input) {
        pipeline = await getPipelineInputSchemaById(id);
      } else if (body.output) {
        pipeline = await getPipelineOutputSchemaById(id);
      }

      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      }

      const response = {} as Validation;

      if (pipeline?.input_schema) {
        try {
          const validate = ajv.compile(pipeline.input_schema);
          if (!validate(body.input) && validate.errors) {
            response.input = validate.errors;
          }
        } catch (e: any) {
          response.input = e.message;
        }
      }

      if (pipeline?.output_schema) {
        try {
          const validate = ajv.compile(pipeline.output_schema);
          if (!validate(body.output) && validate.errors) {
            response.output = validate.errors;
          }
        } catch (e: any) {
          response.output = e.message;
        }
      }

      if (response.input || response.output) {
        reply.code(400).send(response);
      } else {
        return response;
      }
    }
  );

  done();
};

export default routes;
