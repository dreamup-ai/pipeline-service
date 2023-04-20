import { FromSchema } from "json-schema-to-ts";

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
} as const;

export type Pipeline = FromSchema<typeof pipelineSchema>;

export const jsonSchemaSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    JSONSchema4: {
      description: "JSON Schema V4",
      properties: {
        $ref: {
          type: "string",
        },
        $schema: {
          $ref: "#/definitions/JSONSchema4Version",
        },
        additionalItems: {
          anyOf: [
            {
              type: "boolean",
            },
            {
              $ref: "#/definitions/JSONSchema4",
            },
          ],
          description:
            'May only be defined when "items" is defined, and is a tuple of JSONSchemas.\n\nThis provides a definition for additional items in an array instance when tuple definitions of the items is provided.  This can be false to indicate additional items in the array are not allowed, or it can be a schema that defines the schema of the additional items.',
        },
        additionalProperties: {
          anyOf: [
            {
              type: "boolean",
            },
            {
              $ref: "#/definitions/JSONSchema4",
            },
          ],
          description:
            "This attribute defines a schema for all properties that are not explicitly defined in an object type definition. If specified, the value MUST be a schema or a boolean. If false is provided, no additional properties are allowed beyond the properties defined in the schema. The default value is an empty schema which allows any value for additional properties.",
        },
        allOf: {
          items: {
            $ref: "#/definitions/JSONSchema4",
          },
          type: "array",
        },
        anyOf: {
          items: {
            $ref: "#/definitions/JSONSchema4",
          },
          type: "array",
        },
        default: {
          $ref: "#/definitions/JSONSchema4Type",
        },
        definitions: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema4",
          },
          type: "object",
        },
        dependencies: {
          additionalProperties: {
            anyOf: [
              {
                $ref: "#/definitions/JSONSchema4",
              },
              {
                items: {
                  type: "string",
                },
                type: "array",
              },
            ],
          },
          type: "object",
        },
        description: {
          description:
            "This attribute is a string that provides a full description of the of purpose the instance property.",
          type: "string",
        },
        enum: {
          description:
            "This provides an enumeration of all possible values that are valid for the instance property. This MUST be an array, and each item in the array represents a possible value for the instance value. If this attribute is defined, the instance value MUST be one of the values in the array in order for the schema to be valid.",
          items: {
            $ref: "#/definitions/JSONSchema4Type",
          },
          type: "array",
        },
        exclusiveMaximum: {
          type: "boolean",
        },
        exclusiveMinimum: {
          type: "boolean",
        },
        extends: {
          anyOf: [
            {
              type: "string",
            },
            {
              items: {
                type: "string",
              },
              type: "array",
            },
          ],
          description:
            "The value of this property MUST be another schema which will provide a base schema which the current schema will inherit from.  The inheritance rules are such that any instance that is valid according to the current schema MUST be valid according to the referenced schema.  This MAY also be an array, in which case, the instance MUST be valid for all the schemas in the array.  A schema that extends another schema MAY define additional attributes, constrain existing attributes, or add other constraints.\n\nConceptually, the behavior of extends can be seen as validating an instance against all constraints in the extending schema as well as the extended schema(s).",
        },
        format: {
          type: "string",
        },
        id: {
          type: "string",
        },
        items: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema4",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema4",
              },
              type: "array",
            },
          ],
          description:
            'This attribute defines the allowed items in an instance array, and MUST be a schema or an array of schemas.  The default value is an empty schema which allows any value for items in the instance array.\n\nWhen this attribute value is a schema and the instance value is an array, then all the items in the array MUST be valid according to the schema.\n\nWhen this attribute value is an array of schemas and the instance value is an array, each position in the instance array MUST conform to the schema in the corresponding position for this array.  This called tuple typing.  When tuple typing is used, additional items are allowed, disallowed, or constrained by the "additionalItems" (Section 5.6) attribute using the same rules as "additionalProperties" (Section 5.4) for objects.',
        },
        maxItems: {
          type: "number",
        },
        maxLength: {
          type: "number",
        },
        maxProperties: {
          type: "number",
        },
        maximum: {
          type: "number",
        },
        minItems: {
          type: "number",
        },
        minLength: {
          type: "number",
        },
        minProperties: {
          type: "number",
        },
        minimum: {
          type: "number",
        },
        multipleOf: {
          type: "number",
        },
        not: {
          $ref: "#/definitions/JSONSchema4",
        },
        oneOf: {
          items: {
            $ref: "#/definitions/JSONSchema4",
          },
          type: "array",
        },
        pattern: {
          type: "string",
        },
        patternProperties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema4",
          },
          description:
            "This attribute is an object that defines the schema for a set of property names of an object instance. The name of each property of this attribute's object is a regular expression pattern in the ECMA 262/Perl 5 format, while the value is a schema. If the pattern matches the name of a property on the instance object, the value of the instance's property MUST be valid against the pattern name's schema value.",
          type: "object",
        },
        properties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema4",
          },
          description:
            "This attribute is an object with property definitions that define the valid values of instance object property values. When the instance value is an object, the property values of the instance object MUST conform to the property definitions in this object. In this object, each property definition's value MUST be a schema, and the property's name MUST be the name of the instance property that it defines.  The instance property value MUST be valid according to the schema from the property definition. Properties are considered unordered, the order of the instance properties MAY be in any order.",
          type: "object",
        },
        required: {
          anyOf: [
            {
              type: "boolean",
            },
            {
              items: {
                type: "string",
              },
              type: "array",
            },
          ],
          description:
            "This attribute indicates if the instance must have a value, and not be undefined. This is false by default, making the instance optional.",
        },
        title: {
          description:
            "This attribute is a string that provides a short description of the instance property.",
          type: "string",
        },
        type: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema4TypeName",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema4TypeName",
              },
              type: "array",
            },
          ],
          description: "A single type, or a union of simple types",
        },
        uniqueItems: {
          type: "boolean",
        },
      },
      type: "object",
    },
    JSONSchema4Array: {
      items: {
        $ref: "#/definitions/JSONSchema4Type",
      },
      type: "array",
    },
    JSONSchema4Object: {
      additionalProperties: {
        $ref: "#/definitions/JSONSchema4Type",
      },
      type: "object",
    },
    JSONSchema4Type: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
        {
          type: "boolean",
        },
        {
          $ref: "#/definitions/JSONSchema4Object",
        },
        {
          $ref: "#/definitions/JSONSchema4Array",
        },
        {
          type: "null",
        },
      ],
    },
    JSONSchema4TypeName: {
      enum: [
        "string",
        "number",
        "integer",
        "boolean",
        "object",
        "array",
        "null",
        "any",
      ],
      type: "string",
    },
    JSONSchema4Version: {
      description:
        "Meta schema\n\nRecommended values:\n- 'http://json-schema.org/schema#'\n- 'http://json-schema.org/hyper-schema#'\n- 'http://json-schema.org/draft-04/schema#'\n- 'http://json-schema.org/draft-04/hyper-schema#'\n- 'http://json-schema.org/draft-03/schema#'\n- 'http://json-schema.org/draft-03/hyper-schema#'",
      type: "string",
    },
    JSONSchema6: {
      additionalProperties: false,
      properties: {
        $id: {
          type: "string",
        },
        $ref: {
          type: "string",
        },
        $schema: {
          $ref: "#/definitions/JSONSchema6Version",
        },
        additionalItems: {
          $ref: "#/definitions/JSONSchema6Definition",
          description:
            'This keyword determines how child instances validate for arrays, and does not directly validate the immediate instance itself. If "items" is an array of schemas, validation succeeds if every instance element at a position greater than the size of "items" validates against "additionalItems". Otherwise, "additionalItems" MUST be ignored, as the "items" schema (possibly the default value of an empty schema) is applied to all elements. Omitting this keyword has the same behavior as an empty schema.',
        },
        additionalProperties: {
          $ref: "#/definitions/JSONSchema6Definition",
          description:
            "This attribute defines a schema for all properties that are not explicitly defined in an object type definition. If specified, the value MUST be a schema or a boolean. If false is provided, no additional properties are allowed beyond the properties defined in the schema. The default value is an empty schema which allows any value for additional properties.",
        },
        allOf: {
          items: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          type: "array",
        },
        anyOf: {
          items: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          type: "array",
        },
        const: {
          $ref: "#/definitions/JSONSchema6Type",
          description: 'More readable form of a one-element "enum"',
        },
        contains: {
          $ref: "#/definitions/JSONSchema6Definition",
          description:
            'An array instance is valid against "contains" if at least one of its elements is valid against the given schema.',
        },
        default: {
          $ref: "#/definitions/JSONSchema6Type",
          description:
            "This keyword can be used to supply a default JSON value associated with a particular schema. It is RECOMMENDED that a default value be valid against the associated schema.",
        },
        definitions: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          type: "object",
        },
        dependencies: {
          additionalProperties: {
            anyOf: [
              {
                $ref: "#/definitions/JSONSchema6Definition",
              },
              {
                items: {
                  type: "string",
                },
                type: "array",
              },
            ],
          },
          description:
            "This keyword specifies rules that are evaluated if the instance is an object and contains a certain property. Each property specifies a dependency. If the dependency value is an array, each element in the array must be unique. Omitting this keyword has the same behavior as an empty object.",
          type: "object",
        },
        description: {
          description:
            "This attribute is a string that provides a full description of the of purpose the instance property.",
          type: "string",
        },
        enum: {
          description:
            "This provides an enumeration of all possible values that are valid for the instance property. This MUST be an array, and each item in the array represents a possible value for the instance value. If this attribute is defined, the instance value MUST be one of the values in the array in order for the schema to be valid.",
          items: {
            $ref: "#/definitions/JSONSchema6Type",
          },
          type: "array",
        },
        examples: {
          description:
            'Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword',
          items: {
            $ref: "#/definitions/JSONSchema6Type",
          },
          type: "array",
        },
        exclusiveMaximum: {
          description:
            'Representing an exclusive upper limit for a numeric instance. This keyword validates only if the instance is strictly less than (not equal to) to "exclusiveMaximum".',
          type: "number",
        },
        exclusiveMinimum: {
          description:
            'Representing an exclusive lower limit for a numeric instance. This keyword validates only if the instance is strictly greater than (not equal to) to "exclusiveMinimum".',
          type: "number",
        },
        format: {
          type: "string",
        },
        items: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema6Definition",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema6Definition",
              },
              type: "array",
            },
          ],
          description:
            "This keyword determines how child instances validate for arrays, and does not directly validate the immediate instance itself. Omitting this keyword has the same behavior as an empty schema.",
        },
        maxItems: {
          description:
            'Must be a non-negative integer. An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.',
          type: "number",
        },
        maxLength: {
          description:
            "Must be a non-negative integer. A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.",
          type: "number",
        },
        maxProperties: {
          description:
            'Must be a non-negative integer. An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.',
          type: "number",
        },
        maximum: {
          description:
            'Representing an inclusive upper limit for a numeric instance. This keyword validates only if the instance is less than or exactly equal to "maximum".',
          type: "number",
        },
        minItems: {
          description:
            'Must be a non-negative integer. An array instance is valid against "maxItems" if its size is greater than, or equal to, the value of this keyword. Omitting this keyword has the same behavior as a value of 0.',
          type: "number",
        },
        minLength: {
          description:
            "Must be a non-negative integer. A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword. Omitting this keyword has the same behavior as a value of 0.",
          type: "number",
        },
        minProperties: {
          description:
            'Must be a non-negative integer. An object instance is valid against "maxProperties" if its number of properties is greater than, or equal to, the value of this keyword. Omitting this keyword has the same behavior as a value of 0.',
          type: "number",
        },
        minimum: {
          description:
            'Representing an inclusive lower limit for a numeric instance. This keyword validates only if the instance is greater than or exactly equal to "minimum".',
          type: "number",
        },
        multipleOf: {
          description:
            "Must be strictly greater than 0. A numeric instance is valid only if division by this keyword's value results in an integer.",
          type: "number",
        },
        not: {
          $ref: "#/definitions/JSONSchema6Definition",
        },
        oneOf: {
          items: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          type: "array",
        },
        pattern: {
          description:
            "Should be a valid regular expression, according to the ECMA 262 regular expression dialect.",
          type: "string",
        },
        patternProperties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          description:
            "This attribute is an object that defines the schema for a set of property names of an object instance. The name of each property of this attribute's object is a regular expression pattern in the ECMA 262, while the value is a schema. If the pattern matches the name of a property on the instance object, the value of the instance's property MUST be valid against the pattern name's schema value. Omitting this keyword has the same behavior as an empty object.",
          type: "object",
        },
        properties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema6Definition",
          },
          description:
            "This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself. Validation succeeds if, for each name that appears in both the instance and as a name within this keyword's value, the child instance for that name successfully validates against the corresponding schema. Omitting this keyword has the same behavior as an empty object.",
          type: "object",
        },
        propertyNames: {
          $ref: "#/definitions/JSONSchema6Definition",
          description:
            "Takes a schema which validates the names of all properties rather than their values. Note the property name that the schema is testing will always be a string. Omitting this keyword has the same behavior as an empty schema.",
        },
        required: {
          description:
            "Elements of this array must be unique. An object instance is valid against this keyword if every item in the array is the name of a property in the instance. Omitting this keyword has the same behavior as an empty array.",
          items: {
            type: "string",
          },
          type: "array",
        },
        title: {
          description:
            "This attribute is a string that provides a short description of the instance property.",
          type: "string",
        },
        type: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema6TypeName",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema6TypeName",
              },
              type: "array",
            },
          ],
          description: "A single type, or a union of simple types",
        },
        uniqueItems: {
          description:
            "If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique. Omitting this keyword has the same behavior as a value of false.",
          type: "boolean",
        },
      },
      type: "object",
    },
    JSONSchema6Array: {
      items: {
        $ref: "#/definitions/JSONSchema6Type",
      },
      type: "array",
    },
    JSONSchema6Definition: {
      anyOf: [
        {
          $ref: "#/definitions/JSONSchema6",
        },
        {
          type: "boolean",
        },
      ],
      description: "JSON Schema V6",
    },
    JSONSchema6Object: {
      additionalProperties: {
        $ref: "#/definitions/JSONSchema6Type",
      },
      type: "object",
    },
    JSONSchema6Type: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
        {
          type: "boolean",
        },
        {
          $ref: "#/definitions/JSONSchema6Object",
        },
        {
          $ref: "#/definitions/JSONSchema6Array",
        },
        {
          type: "null",
        },
      ],
    },
    JSONSchema6TypeName: {
      enum: [
        "string",
        "number",
        "integer",
        "boolean",
        "object",
        "array",
        "null",
        "any",
      ],
      type: "string",
    },
    JSONSchema6Version: {
      description:
        "Meta schema\n\nRecommended values:\n- 'http://json-schema.org/schema#'\n- 'http://json-schema.org/hyper-schema#'\n- 'http://json-schema.org/draft-06/schema#'\n- 'http://json-schema.org/draft-06/hyper-schema#'",
      type: "string",
    },
    JSONSchema7: {
      additionalProperties: false,
      properties: {
        $comment: {
          type: "string",
        },
        $defs: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "object",
        },
        $id: {
          type: "string",
        },
        $ref: {
          type: "string",
        },
        $schema: {
          $ref: "#/definitions/JSONSchema7Version",
        },
        additionalItems: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        additionalProperties: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        allOf: {
          items: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "array",
        },
        anyOf: {
          items: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "array",
        },
        const: {
          $ref: "#/definitions/JSONSchema7Type",
        },
        contains: {
          $ref: "#/definitions/JSONSchema7",
        },
        contentEncoding: {
          type: "string",
        },
        contentMediaType: {
          type: "string",
        },
        default: {
          $ref: "#/definitions/JSONSchema7Type",
        },
        definitions: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "object",
        },
        dependencies: {
          additionalProperties: {
            anyOf: [
              {
                $ref: "#/definitions/JSONSchema7Definition",
              },
              {
                items: {
                  type: "string",
                },
                type: "array",
              },
            ],
          },
          type: "object",
        },
        description: {
          type: "string",
        },
        else: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        enum: {
          items: {
            $ref: "#/definitions/JSONSchema7Type",
          },
          type: "array",
        },
        examples: {
          $ref: "#/definitions/JSONSchema7Type",
        },
        exclusiveMaximum: {
          type: "number",
        },
        exclusiveMinimum: {
          type: "number",
        },
        format: {
          type: "string",
        },
        if: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        items: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema7Definition",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema7Definition",
              },
              type: "array",
            },
          ],
        },
        maxItems: {
          type: "number",
        },
        maxLength: {
          type: "number",
        },
        maxProperties: {
          type: "number",
        },
        maximum: {
          type: "number",
        },
        minItems: {
          type: "number",
        },
        minLength: {
          type: "number",
        },
        minProperties: {
          type: "number",
        },
        minimum: {
          type: "number",
        },
        multipleOf: {
          type: "number",
        },
        not: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        oneOf: {
          items: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "array",
        },
        pattern: {
          type: "string",
        },
        patternProperties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "object",
        },
        properties: {
          additionalProperties: {
            $ref: "#/definitions/JSONSchema7Definition",
          },
          type: "object",
        },
        propertyNames: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        readOnly: {
          type: "boolean",
        },
        required: {
          items: {
            type: "string",
          },
          type: "array",
        },
        then: {
          $ref: "#/definitions/JSONSchema7Definition",
        },
        title: {
          type: "string",
        },
        type: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema7TypeName",
            },
            {
              items: {
                $ref: "#/definitions/JSONSchema7TypeName",
              },
              type: "array",
            },
          ],
        },
        uniqueItems: {
          type: "boolean",
        },
        writeOnly: {
          type: "boolean",
        },
      },
      type: "object",
    },
    JSONSchema7Array: {
      items: {
        $ref: "#/definitions/JSONSchema7Type",
      },
      type: "array",
    },
    JSONSchema7Definition: {
      anyOf: [
        {
          $ref: "#/definitions/JSONSchema7",
        },
        {
          type: "boolean",
        },
      ],
      description: "JSON Schema v7",
    },
    JSONSchema7Object: {
      additionalProperties: {
        $ref: "#/definitions/JSONSchema7Type",
      },
      type: "object",
    },
    JSONSchema7Type: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
        {
          type: "boolean",
        },
        {
          $ref: "#/definitions/JSONSchema7Object",
        },
        {
          $ref: "#/definitions/JSONSchema7Array",
        },
        {
          type: "null",
        },
      ],
      description: "Primitive type",
    },
    JSONSchema7TypeName: {
      description: "Primitive type",
      enum: [
        "string",
        "number",
        "integer",
        "boolean",
        "object",
        "array",
        "null",
      ],
      type: "string",
    },
    JSONSchema7Version: {
      description:
        "Meta schema\n\nRecommended values:\n- 'http://json-schema.org/schema#'\n- 'http://json-schema.org/hyper-schema#'\n- 'http://json-schema.org/draft-07/schema#'\n- 'http://json-schema.org/draft-07/hyper-schema#'",
      type: "string",
    },
    "NamedParameters<typeof checkPropertyChange>": {
      additionalProperties: false,
      properties: {
        property: {
          type: "string",
        },
        schema: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema4",
            },
            {
              $ref: "#/definitions/JSONSchema6",
            },
            {
              $ref: "#/definitions/JSONSchema7",
            },
          ],
        },
        value: {},
      },
      required: ["value", "schema", "property"],
      type: "object",
    },
    "NamedParameters<typeof mustBeValid>": {
      additionalProperties: false,
      properties: {
        result: {
          $ref: "#/definitions/ValidationResult",
        },
      },
      required: ["result"],
      type: "object",
    },
    "NamedParameters<typeof validate>": {
      additionalProperties: false,
      properties: {
        instance: {
          additionalProperties: false,
          type: "object",
        },
        schema: {
          anyOf: [
            {
              $ref: "#/definitions/JSONSchema4",
            },
            {
              $ref: "#/definitions/JSONSchema6",
            },
            {
              $ref: "#/definitions/JSONSchema7",
            },
          ],
        },
      },
      required: ["instance", "schema"],
      type: "object",
    },
    ValidationError: {
      additionalProperties: false,
      properties: {
        message: {
          type: "string",
        },
        property: {
          type: "string",
        },
      },
      required: ["property", "message"],
      type: "object",
    },
    ValidationResult: {
      additionalProperties: false,
      properties: {
        errors: {
          items: {
            $ref: "#/definitions/ValidationError",
          },
          type: "array",
        },
        valid: {
          type: "boolean",
        },
      },
      required: ["valid", "errors"],
      type: "object",
    },
  },
} as const;

export type JsonSchema = FromSchema<typeof jsonSchemaSchema>;

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
} as const;

export type DeletedResponse = FromSchema<typeof deletedResponseSchema>;

export const errorResponseSchema = {
  type: "object",
  properties: {
    error: {
      type: "string",
    },
  },
} as const;

export type ErrorResponse = FromSchema<typeof errorResponseSchema>;

export const paginationTokenSchema = {
  type: "string",
  description: "A token to be used in the next request to get the next page",
  nullable: true,
} as const;

export type PaginationToken = FromSchema<typeof paginationTokenSchema>;

export const signatureHeaderSchema = {
  type: "object",
  properties: {},
  patternProperties: {
    "^x-w+-signature$": {
      type: "string",
    },
  },
} as const;

export type SignatureHeader = FromSchema<typeof signatureHeaderSchema>;

export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
} as const;

export type IdParam = FromSchema<typeof idParamSchema>;
