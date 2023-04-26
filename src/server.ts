import * as dotenv from "dotenv";
dotenv.config({ override: true, path: `./.env.${process.env.APP_ENV}` });
import config from "./config";
import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import cookie from "@fastify/cookie";
import { pipelineSchema } from "./types";

export const build = async (opts: FastifyServerOptions) => {
  const server = Fastify(opts).withTypeProvider<JsonSchemaToTsProvider>();

  await server.register(require("@fastify/swagger"), {
    routePrefix: "/docs",
    exposeRoute: true,
    mode: "dynamic",
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Dreamup User API",
        description: "API for Dreamup User Management",
        version: "0.9.0",
      },
      webhooks: {
        "pipeline.created": {
          description: "Pipeline created",
          post: {
            requestBody: {
              description: "Pipeline created",
              content: {
                "application/json": {
                  schema: pipelineSchema,
                },
              },
            },
            responses: {
              "200": {
                description: "Return a 200 status to acknowledge the webhook",
              },
            },
          },
        },
        "pipeline.updated": {
          description: "Pipeline updated",
          post: {
            requestBody: {
              description: "Updated Pipeline",
              content: {
                "application/json": {
                  schema: pipelineSchema,
                },
              },
            },
            responses: {
              "200": {
                description: "Return a 200 status to acknowledge the webhook",
              },
            },
          },
        },
        "pipeline.deleted": {
          description: "Pipeline deleted",
          post: {
            requestBody: {
              description: "Deleted Pipeline",
              content: {
                "application/json": {
                  schema: pipelineSchema,
                },
              },
            },
            responses: {
              "200": {
                description: "Return a 200 status to acknowledge the webhook",
              },
            },
          },
        },
      },

      servers: [{ url: config.server.publicUrl }],
    },
    hideUntagged: false,
  });
  await server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    exposeRoute: true,
  });

  server.get(
    "/hc",
    {
      schema: {
        response: {
          200: {
            type: "string",
          },
        },
      },
    },
    async () => {
      return "OK";
    }
  );
  server.setErrorHandler((error, request, reply) => {
    const { message, statusCode, validation, validationContext } = error;
    if (validation) {
      reply.status(400).send({
        error: message,
      });
    } else {
      // This is the only place we do something different from prod and dev
      if (process.env.NODE_ENV === "production") {
        server.log.error(error);
      } else {
        // Stack traces are easy to read this way than with single-line json objects
        console.error(error);
      }
      reply.status(statusCode || 500).send({
        error: message,
      });
    }
  });

  server.register(cookie);

  await server.ready();
  return server;
};

export const start = async (server: FastifyInstance) => {
  try {
    await server.listen({ port: config.server.port, host: config.server.host });
  } catch (e) {
    server.log.error(e);
    process.exit(1);
  }
};
