# Game Session Manager Backend

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src` - Code for the application's Lambda function.
- `__tests__` - Unit tests for the application code.
- `template.yaml` - A template that defines the application's AWS resources.

## Prerequisites

To deploy and run this application, you'll need the following tools:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js 18 or 20](https://nodejs.org/en/), including the npm package management tool.
- Docker (optional for testing locally) - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).
- AWS Account - [Sign up for an AWS account](https://aws.amazon.com/free/).
- AWS CLI - [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

## AWS Credentials

Before deploying the application, you must configure your AWS credentials. These credentials are necessary for the AWS SAM CLI to deploy your application to AWS.

1. **Generate AWS Access Keys**:

   - You need to create an user to generate your access keys.
   - Go to the [IAM Management Console](https://console.aws.amazon.com/iam/home) in your AWS account.
   - Create a new IAM user with programmatic access and attach the necessary policies (e.g., `AdministratorAccess` or specific permissions for Lambda, API Gateway, and DynamoDB such as `AWSLambda_FullAccess`, `AmazonAPIGatewayAdministrator` and `AmazonDynamoDBFullAccess`).
   - Download the access keys (Access Key ID and Secret Access Key).

2. **Configure AWS CLI**:
   - Run `aws configure` in your terminal.
   - Enter your Access Key ID, Secret Access Key, default region, and output format when prompted.

```bash
aws configure
```

## Deploy the Sample Application

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts.

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Use the AWS SAM CLI to Build and Test Locally

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

## Additional Notes

- **Security**: Ensure that your AWS credentials (Access Key ID and Secret Access Key) are stored securely and not hard-coded in your application code.
