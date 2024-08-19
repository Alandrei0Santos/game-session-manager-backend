const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;

exports.createGameSessionHandler = async (event) => {
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

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      headers: responseHeaders,
      body: JSON.stringify({
        error: `Method not allowed. Expected POST, got ${event.httpMethod}`,
      }),
    };
  }

  console.info("Received event:", event);

  const body = JSON.parse(event.body);
  const { hostname, players, mapSpawn, gameMode } = body;

  const sessionId = uuidv4();

  const params = {
    TableName: tableName,
    Item: {
      sessionId, // UUID for the session
      hostname, // Hostname for the session
      players, // Number of players
      mapSpawn, // Game map
      gameMode, // Game mode
    },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - game session created:", data);
  } catch (err) {
    console.error("Error creating game session:", err.stack);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Could not create game session" }),
    };
  }

  const response = {
    statusCode: 201,
    headers: responseHeaders,
    body: JSON.stringify({
      message: "Game session created successfully",
      sessionId: sessionId,
    }),
  };

  console.info(
    `Response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
