# Scrapy
## Description
Selenium scraping tool with multiple features. Currently built to run with Docker, Node and 
Serverless. Can be run as an express HTTP server or a CLI command

Supported sites
- Shopify

## Setting up
Running in local
> This runs as nodemon which allows watch
1. `npm install`
2. `npm run dev`

Running in docker
> To run this in docker, you will need to use docker-compose due to the naming convention in placed for serverless
1. `docker-compose build`
2. `docker-compose up`

Running the application
> To run the application with arguments

`npm run build`

`npm run start -- <arg>`

## Running serverless
### Deployment instructions

> **Requirements**: Docker. In order to build images locally and push them to ECR, you need to have Docker installed on your local machine. Please refer to [official documentation](https://docs.docker.com/get-docker/).

In order to deploy your service, run the following command

```
sls deploy
```

## Test your service

After successful deployment, you can test your service remotely by using the following command:

```
sls invoke --function hello
```

## References
- https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f
- https://www.serverless.com/blog/container-support-for-lambda
## Licence
MIT


