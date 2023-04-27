import { client as dynamo } from "./clients/dynamo";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import config from "./config";
import { v4 as uuid4 } from "uuid";
import { Item } from "dynamo-tools";
import { Pipeline } from "./types";
import { sendWebhook } from "./webhooks";
import { FastifyBaseLogger } from "fastify";

const { pipelineTable } = config.db;
const { toObject, fromObject } = Item;

export const getPipelineById = async (id: string) => {
  const { Item } = await dynamo.send(
    new GetItemCommand({
      TableName: pipelineTable,
      Key: {
        id: { S: id },
      },
    })
  );
  if (!Item) {
    return null;
  }
  return toObject(Item);
};

export const getPipelineInputSchemaById = async (id: string) => {
  const { Item } = await dynamo.send(
    new GetItemCommand({
      TableName: pipelineTable,
      Key: {
        id: { S: id },
      },
      ProjectionExpression: "input_schema",
    })
  );
  if (!Item) {
    return null;
  }
  return toObject(Item);
};

export const getPipelineOutputSchemaById = async (id: string) => {
  const { Item } = await dynamo.send(
    new GetItemCommand({
      TableName: pipelineTable,
      Key: {
        id: { S: id },
      },
      ProjectionExpression: "output_schema",
    })
  );
  if (!Item) {
    return null;
  }
  return toObject(Item);
};

/**
 * Creates a new pipeline in the database. If the pipeline already exists, it will return null.
 * If the pipeline is created, it will return the pipeline object. If the pipeline provided does
 * not have an ID, it will generate one via uuid v4.
 */
export const createPipeline = async (
  pipeline: Pipeline,
  log: FastifyBaseLogger
) => {
  if (!pipeline.id) {
    pipeline.id = uuid4();
  }
  const Item = fromObject(pipeline);
  try {
    await dynamo.send(
      new PutItemCommand({
        TableName: pipelineTable,
        Item,
        ConditionExpression: "attribute_not_exists(id)",
      })
    );
    sendWebhook("pipeline.created", pipeline, log);
    return pipeline;
  } catch (e: any) {
    if (e.code === "ConditionalCheckFailedException") {
      return null;
    }
    throw e;
  }
};

/**
 * Returns an object with the UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
 * for an arbitrarily nested update. This is useful for updating nested objects in DynamoDB.
 *
 * Example:
 * { some: { deeply: { nested: { value: 1 } } } }
 *
 * Will return:
 * {
 *  UpdateExpression: SET #K0.#K1.#K2.#K3 = :val0,
 *  ExpressionAttributeNames: { "#K0": "some", "#K1": "deeply", "#K2": "nested", "#K3": "value" },
 *  ExpressionAttributeValues: { ":val0": { N: "1" } }
 * }
 *
 * @param data
 * @returns
 */
export const getUpdateExpressionForArbitrarilyNestedUpdate = (data: any) => {
  let UpdateExpression: string = "";
  const ExpressionAttributeNames: any = {};
  const ExpressionAttributeValues: any = {};
  const subExpressions: string[] = [];

  const recurse = (obj: any, path: string[] = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const i = Object.keys(ExpressionAttributeNames).length;
      const keyVar = `#K${i}`;
      ExpressionAttributeNames[keyVar] = key;

      if (typeof value === "object") {
        /**
         * Recurse into the nested object, keeping a path like
         * ["#K0", "#K1", "#K2", "#K3"]
         */
        recurse(value, [...path, keyVar]);
      } else {
        const i = Object.keys(ExpressionAttributeValues).length;
        ExpressionAttributeValues[`:val${i}`] = fromObject(value);

        /**
         * The update expression includes the full nested path, e.g.
         * #K0.#K1.#K2.#K3 = :val0
         * */
        subExpressions.push(`${[...path, keyVar].join(".")} = :val${i}`);
      }
    });
  };
  recurse(data);

  UpdateExpression = `SET ${subExpressions.join(", ")}`;

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

export const updatePipelineById = async (
  id: string,
  data: Pipeline,
  log: FastifyBaseLogger
) => {
  const updateParams = {
    TableName: pipelineTable,
    Key: {
      id: { S: id },
    },
    ...getUpdateExpressionForArbitrarilyNestedUpdate(data),
    ReturnValues: "ALL_NEW",
    ConditionExpression: "attribute_exists(id)",
  };

  const updateCmd = new UpdateItemCommand(updateParams);
  try {
    const { Attributes } = await dynamo.send(updateCmd);
    const pipeline = toObject(Attributes);
    sendWebhook("pipeline.updated", pipeline, log);
    return pipeline;
  } catch (e: any) {
    if (e.code === "ConditionalCheckFailedException") {
      return null;
    }
    throw e;
  }
};

export const deletePipelineById = async (
  id: string,
  log: FastifyBaseLogger
) => {
  const deleteCmd = new DeleteItemCommand({
    TableName: pipelineTable,
    Key: {
      id: { S: id },
    },
    ReturnValues: "ALL_OLD",
    ConditionExpression: "attribute_exists(id)",
  });
  try {
    const { Attributes } = await dynamo.send(deleteCmd);
    const pipeline = toObject(Attributes);
    sendWebhook("pipeline.deleted", pipeline, log);
    return pipeline;
  } catch (e: any) {
    if (e.code === "ConditionalCheckFailedException") {
      return null;
    }
    throw e;
  }
};
