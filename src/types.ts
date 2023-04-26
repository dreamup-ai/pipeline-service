import { FromSchema, JSONSchema7 } from "json-schema-to-ts";

export const pipelineSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    model_type: {
      type: "string",
    },
    input_schema: {
      type: "object",
      description: "A JSON Schema describing the input to the pipeline",
    },
    output_schema: {
      type: "object",
      description: "A JSON Schema describing the output of the pipeline",
    },
  },
} as const satisfies JSONSchema7;

export type Pipeline = FromSchema<typeof pipelineSchema>;

export const deletedResponseSchema = {
  type: "object",
  properties: {
    deleted: {
      type: "boolean",
      default: true,
    },
    id: {
      type: "string",
      format: "uuid4",
    },
  },
} as const satisfies JSONSchema7;

export type DeletedResponse = FromSchema<typeof deletedResponseSchema>;

export const errorResponseSchema = {
  type: "object",
  properties: {
    error: {
      type: "string",
    },
  },
} as const satisfies JSONSchema7;

export type ErrorResponse = FromSchema<typeof errorResponseSchema>;

export const paginationTokenSchema = {
  type: "string",
  description: "A token to be used in the next request to get the next page",
  nullable: true,
} as const satisfies JSONSchema7;

export type PaginationToken = FromSchema<typeof paginationTokenSchema>;

export const signatureHeaderSchema = {
  type: "object",
  properties: {},
  patternProperties: {
    "^x-w+-signature$": {
      type: "string",
    },
  },
} as const satisfies JSONSchema7;

export type SignatureHeader = FromSchema<typeof signatureHeaderSchema>;

export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
} as const satisfies JSONSchema7;

export type IdParam = FromSchema<typeof idParamSchema>;
