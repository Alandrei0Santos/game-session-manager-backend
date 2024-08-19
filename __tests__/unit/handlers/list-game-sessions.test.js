const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const {
  listGameSessionsHandler,
} = require("../../../src/handlers/list-game-sessions");

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const sendMock = jest.fn();

  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: sendMock,
      })),
    },
    ScanCommand: jest.fn(),
    __mocks__: {
      sendMock,
    },
  };
});

describe("listGameSessionsHandler", () => {
  const mockTableName = "GameSessions";
  let sendMock;

  beforeEach(() => {
    process.env.TABLE_NAME = mockTableName;

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

  it("should successfully retrieve a list of game sessions", async () => {
    const event = {
      httpMethod: "GET",
    };

    const mockItems = [
      {
        sessionId: "id1",
        hostname: "host1",
        players: 4,
        mapSpawn: "desert",
        gameMode: "deathmatch",
      },
      {
        sessionId: "id2",
        hostname: "host2",
        players: 2,
        mapSpawn: "forest",
        gameMode: "survival",
      },
    ];

    sendMock.mockResolvedValue({ Items: mockItems });

    const result = await listGameSessionsHandler(event);

    expect(sendMock).toHaveBeenCalledWith(
      new ScanCommand({
        TableName: mockTableName,
        ProjectionExpression:
          "sessionId, hostname, players, mapSpawn, gameMode",
      })
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockItems);
  });

  it("should return a 405 status code for non-GET methods", async () => {
    const event = {
      httpMethod: "POST",
    };

    const result = await listGameSessionsHandler(event);

    expect(result.statusCode).toBe(405);
    expect(JSON.parse(result.body)).toEqual({
      error: "Method not allowed. Expected GET, got POST",
    });
  });

  it("should return a 500 status code if DynamoDB scan fails", async () => {
    const event = {
      httpMethod: "GET",
    };

    sendMock.mockRejectedValue(new Error("DynamoDB error"));

    const result = await listGameSessionsHandler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Could not retrieve game sessions",
    });
  });
});
