const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;

exports.listGameSessionsHandler = async (event) => {
  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: "CORS preflight response" }),
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405, // Method Not Allowed
      headers: responseHeaders,
      body: JSON.stringify({
        error: `Method not allowed. Expected GET, got ${event.httpMethod}`,
      }),
    };
  }

  console.info("Received event:", event);

  try {
    const params = {
      TableName: tableName,
      ProjectionExpression: "sessionId, hostname, players, mapSpawn, gameMode",
    };

    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log("Success - items retrieved:", data.Items);

    const response = {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(data.Items),
    };

    console.info(
      `Response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
  } catch (err) {
    console.error("Error retrieving game sessions:", err.stack);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Could not retrieve game sessions" }),
    };
  }
};
