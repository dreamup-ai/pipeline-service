import { client as dynamo } from "./clients/dynamo";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import config from "./config";
import { v4 as uuid } from "uuid";
import { toObject, fromObject } from "dynamo-tools";

export const getPipelineById = async (id: string) => {
  const { Item } = await dynamo.send(
    new GetItemCommand({
      TableName: config.db.pipelineTable,
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
