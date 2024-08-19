
# Game Session Manager Backend

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src` - Code for the application's Lambda functions.
- `__tests__` - Unit tests for the application code.
- `template.yaml` - A template that defines the application's AWS resources.

## Deploy the Application

The AWS SAM CLI is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the AWS SAM CLI, you need the following tools:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js 18 or 20](https://nodejs.org/en/), including the npm package management tool.
- Docker (optional for testing locally) - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Use the AWS SAM CLI to build and test locally

Build your application by using the `sam build` command.

```bash
sam build
```

The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
sam local invoke CreateGameSessionFunction
sam local invoke ListGameSessionsFunction
```

The AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` command to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
```

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

## AWS Environment Setup

Before deploying the application, ensure that you have configured your AWS credentials and generated the necessary keys. Follow the instructions on [setting up AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) to set up your environment.

## Conclusion

This project provides a simple yet effective backend for managing game sessions. It leverages AWS services to deliver a scalable and serverless solution. The unit tests ensure that the core functionality works as expected, making it easier to maintain and extend the service in the future.
