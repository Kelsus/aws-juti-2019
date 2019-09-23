const aws = require("aws-sdk");
const uuid = require("uuid");

aws.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const TableName = process.env.DYNAMO_DB_TABLE;
const dynamoDbLib = new aws.DynamoDB.DocumentClient();

function callDynamoAPI(params, operation) {
  return dynamoDbLib[operation](params).promise();
}

function createNote(content = "", attachment = undefined) {
  const params = {
    TableName,
    Item: {
      noteId: uuid.v1(),
      content,
      attachment,
      createdAt: Date.now(),
    }
  };
  return callDynamoAPI(params, "put").then(() => params.Item);
}

function updateNote(noteId, content, attachment) {
  const params = {
    TableName,
    Key: {
      noteId
    },
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": attachment || null,
      ":content": content || null
    },
    ReturnValues: "ALL_NEW"
  };
  return callDynamoAPI(params, "update");
}

function getNote(noteId) {
  const params = {
    TableName,
    Key: {
      noteId
    }
  };
  return callDynamoAPI(params, "get");
}

function listNotes() {
  const params = {
    TableName
  };
  return callDynamoAPI(params, "scan");
}

function removeNote(noteId) {
  const params = {
    TableName,
    Key: {
      noteId
    }
  };
  return callDynamoAPI(params, "delete");
}

module.exports = { createNote, updateNote, listNotes, getNote, removeNote };
