
# Game Session Manager Backend

## Unit Tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
npm install
npm run test
```

The tests mock the AWS SDK methods and validate the following scenarios:

- Successful creation of a game session.
- Error handling for non-POST requests in the `CreateGameSessionFunction`.
- Successful retrieval of game sessions.
- Error handling for non-GET requests in the `ListGameSessionsFunction`.

## Conclusion

This project is pretty much simple for managing game sessions. The unit tests are basically structured to ensure that the status codes are returning correctly and verifies their basic GET and POST functionality
