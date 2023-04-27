import { FastifyInstance } from "fastify";
import {
  createPipeline,
  updatePipelineById,
  getPipelineById,
  deletePipelineById,
  getPipelineInputSchemaById,
  getPipelineOutputSchemaById,
} from "../crud";
import {
  DeletedResponse,
  ErrorResponse,
  IdParam,
  Pipeline,
  PipelineUpdate,
  SignatureHeader,
  deletedResponseSchema,
  errorResponseSchema,
  idParamSchema,
  pipelineSchema,
  pipelineUpdateSchema,
  signatureHeaderSchema,
} from "../types";
import {
  dreamupInternal,
  dreamupUserSession,
  either,
} from "../middleware/audiences";
import { validateSchema } from "../middleware/validate-schema";

const routes = (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.post<{
    Body: Pipeline;
    Headers: SignatureHeader;
    Response: Pipeline | ErrorResponse;
  }>(
    "/pipeline",
    {
      schema: {
        body: pipelineSchema,
        headers: signatureHeaderSchema,
        response: {
          201: pipelineSchema,
          400: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preValidation: [dreamupInternal, validateSchema],
    },
    async (request, reply) => {
      const pipeline = await createPipeline(request.body, fastify.log);
      if (!pipeline) {
        reply.code(409).send({ error: "Pipeline already exists" });
      } else {
        reply.code(201).send(pipeline);
      }
    }
  );

  fastify.get<{
    Params: IdParam;
    Response: Pipeline | ErrorResponse;
  }>(
    "/pipeline/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: pipelineSchema,
          404: errorResponseSchema,
        },
      },
      preValidation: [either(dreamupUserSession, dreamupInternal)],
    },
    async (request, reply) => {
      const pipeline = await getPipelineById(request.params.id);
      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      } else {
        return pipeline;
      }
    }
  );

  fastify.get<{
    Params: IdParam;
    Response: any | ErrorResponse;
  }>(
    "/pipeline/:id/input_schema",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: {
            type: "object",
            description: "A JSON Schema describing the input to the pipeline",
          },
          404: errorResponseSchema,
        },
      },
      preValidation: [either(dreamupUserSession, dreamupInternal)],
    },
    async (request, reply) => {
      const pipeline = await getPipelineInputSchemaById(request.params.id);
      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      } else {
        return pipeline.input_schema;
      }
    }
  );

  fastify.get<{
    Params: IdParam;
    Response: any | ErrorResponse;
  }>(
    "/pipeline/:id/output_schema",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: {
            type: "object",
            description:
              "A JSON Schema describing the output from the pipeline",
          },
          404: errorResponseSchema,
        },
      },
      preValidation: [either(dreamupUserSession, dreamupInternal)],
    },
    async (request, reply) => {
      const pipeline = await getPipelineOutputSchemaById(request.params.id);
      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      } else {
        return pipeline.output_schema;
      }
    }
  );

  fastify.put<{
    Params: IdParam;
    Body: PipelineUpdate;
    Headers: SignatureHeader;
    Response: Pipeline | ErrorResponse;
  }>(
    "/pipeline/:id",
    {
      schema: {
        params: idParamSchema,
        body: pipelineUpdateSchema,
        headers: signatureHeaderSchema,
        response: {
          200: pipelineSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preValidation: [dreamupInternal, validateSchema],
    },
    async (request, reply) => {
      const pipeline = await updatePipelineById(
        request.params.id,
        request.body,
        fastify.log
      );
      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      } else {
        reply.code(200).send(pipeline);
      }
    }
  );

  fastify.delete<{
    Params: IdParam;
    Headers: SignatureHeader;
    Response: DeletedResponse | ErrorResponse;
  }>(
    "/pipeline/:id",
    {
      schema: {
        params: idParamSchema,
        headers: signatureHeaderSchema,
        response: {
          200: deletedResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preValidation: [dreamupInternal],
    },
    async (request, reply) => {
      const pipeline = await deletePipelineById(request.params.id, fastify.log);
      if (!pipeline) {
        reply.code(404).send({ error: "Pipeline not found" });
      } else {
        reply.code(200).send({ deleted: true, id: request.params.id });
      }
    }
  );

  done();
};

export default routes;
