<p align="center">
  <a href="https://github.com/dreamup-ai/pipeline-service/actions/workflows/ecr-build-push.yml"><img src="https://img.shields.io/github/actions/workflow/status/dreamup-ai/pipeline-service/ecr-build-push.yml?label=ecr-build-push&logo=github&style=plastic" alt="github workflow status"></a>
  <a href="https://github.com/dreamup-ai/pipeline-service/actions/workflows/dockerhub-build-push.yml"><img src="https://img.shields.io/github/actions/workflow/status/dreamup-ai/pipeline-service/dockerhub-build-push.yml?label=dockerhub-build-push&logo=github&style=plastic" alt="github workflow status"></a>
  <a href="https://github.com/dreamup-ai/pipeline-service/actions/workflows/dockerhub-description.yml"><img src="https://img.shields.io/github/actions/workflow/status/dreamup-ai/pipeline-service/dockerhub-description.yml?label=dockerhub-readme&logo=github&style=plastic" alt="github workflow status"></a>
  <a href="https://github.com/dreamup-ai/pipeline-service/actions/workflows/run-tests.yml"><img src="https://img.shields.io/github/actions/workflow/status/dreamup-ai/pipeline-service/run-tests.yml?label=run-tests&logo=github&style=plastic" alt="github workflow status"></a>
  <a href="https://hub.docker.com/r/dreamupai/pipeline-service"><img src="https://img.shields.io/docker/v/dreamupai/pipeline-service?label=dockerhub&logo=docker&sort=date&style=plastic" alt="dockerhub image version"></a>
  <a href="https://github.com/dreamup-ai/pipeline-service"><img src="https://img.shields.io/github/package-json/v/dreamup-ai/pipeline-service?color=purple&label=release version&style=plastic" alt="release version"></a>
</p>

# pipeline-service
A service for managing pipelines in dreamup.ai

## What is a pipeline?

A **pipeline** performs a **task** with a **model**.  For example, the `StableDiffusionImageToImagePipeline` pipeline performs the **task** "Text-Guided Image-to-Image Transformation", using any `StableDiffusion` **model**.

## What does the pipeline service do?

The pipeline service provides input and output schemas for every pipeline, and provides a validation endpoint for every pipeline.

## System Requirements

- Docker (including Compose)
- Node 18 (recommend using NVM)

## Getting Set Up To Develop

### Install dependencies

```shell
nvm use
npm install
npm run build
```

### Run Tests

The tests depend on the services defined in `test-dependencies.yml`, in this case DynamoDB local.

```shell
# Start DynamoDB Local
docker compose -f test-dependencies.yml up --detach

# Run Tests
npm test
```

### Run Locally

This project uses `dotenv` to read environment files. Multi-environment setups are supported via the environment variable `APP_ENV`. On start, the server will load `.env.${APP_ENV}`. The `start` script and the `pipeline-service.yml` file both assume `APP_ENV=local`, so you will need to create a file in the root of the directory called `.env.local`. For most purposes, copying `.env.test` should be sufficient. The `.gitignore` contains a rule to ignore `.env*.local` files.

#### Run the server directly

```shell
# Build the project
npm run build

# Make sure dynamo is up, the user-service is up, and the pipeline table is created
npm run init-local

# Start the server
npm start
```

#### Run everything with docker

```shell
npm run compose-up

# OR

./scripts/up

# Down everyting with

npm run compose-down

# OR

./scripts/down
```

You can pass any arguments supported by `docker compose up` and `docker compose down` when using the `up` and `down` scripts, respectively.
