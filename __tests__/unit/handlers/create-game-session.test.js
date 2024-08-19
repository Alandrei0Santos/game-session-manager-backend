const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const {
  createGameSessionHandler,
} = require("../../../src/handlers/create-game-session");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const sendMock = jest.fn();

  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: sendMock,
      })),
    },
    PutCommand: jest.fn(),
    __mocks__: {
      sendMock,
    },
  };
});

describe("createGameSessionHandler", () => {
  const mockUUID = "mocked-uuid";
  const mockTableName = "GameSessions";
  let sendMock;

  beforeEach(() => {
    process.env.TABLE_NAME = mockTableName;
    uuidv4.mockImplementation(() => mockUUID);

    const { __mocks__ } = require("@aws-sdk/lib-dynamodb");
    sendMock = __mocks__.sendMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
    jest.spyOn(global.console, "info").mockImplementation(() => jest.fn());
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully create a game session", async () => {
    const event = {
      httpMethod: "POST",
      body: JSON.stringify({
        hostname: "host1",
        players: 4,
        mapSpawn: "desert",
        gameMode: "deathmatch",
      }),
    };

    const expectedParams = {
      TableName: mockTableName,
      Item: {
        sessionId: mockUUID,
        hostname: "host1",
        players: 4,
        mapSpawn: "desert",
        gameMode: "deathmatch",
      },
    };

    sendMock.mockResolvedValue({});

    const result = await createGameSessionHandler(event);

    expect(sendMock).toHaveBeenCalledWith(new PutCommand(expectedParams));
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      message: "Game session created successfully",
      sessionId: mockUUID,
    });
  });

  it("should return an error response for non-POST methods", async () => {
    const event = {
      httpMethod: "GET",
    };

    const result = await createGameSessionHandler(event);

    expect(result.statusCode).toBe(405);
    expect(JSON.parse(result.body)).toEqual({
      error: "Method not allowed. Expected POST, got GET",
    });
  });

  it("should return a 500 status code if DynamoDB put fails", async () => {
    const event = {
      httpMethod: "POST",
      body: JSON.stringify({
        hostname: "host1",
        players: 4,
        mapSpawn: "desert",
        gameMode: "deathmatch",
      }),
    };

    sendMock.mockRejectedValue(new Error("DynamoDB error"));

    const result = await createGameSessionHandler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Could not create game session",
    });
  });
});
