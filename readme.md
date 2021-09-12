# Scrapy
## Description
Puppeteer scraping tool with multiple features. Currently built to run with Docker, Node and 
Serverless. Can be run as an express HTTP server or a CLI command

Supported sites
- Shopify

## Pre-requisites
- Node 16 (use nvm)
- Python 3.7.2 (https://www.python.org/downloads/) or use (brew install pyenv)
- AWS CLI (https://aws.amazon.com/cli/)
- EB CLI (https://github.com/aws/aws-elastic-beanstalk-cli-setup)
- Postgresql

## Notes
Dockerfile has been renamed to use Dockerfile-aws as there will be a conflict when docker-compose and dockerfile is used

## Configuration
Ensure this is performed before any of the task
1. Set up your environment. Copy .env.example to .env and configure your ports and profiles you want to use
2. To configure profiles, copy discord.example.json to discord.json and configure your profiles
3. To configure headers for puppeteer, copy headers.example.json to headers.json and configure the headers

### Database Setup
1. `npm install pg --save`
2. `npx sequelize-cli db:create`

## Running in Docker and Development
### Local Development
> This runs as nodemon which allows watch
1. `npm install`
2. `npm run dev`

or 

2. `npm run build`
3. `npm run start -- <arg>`

### Running in docker
> To run this in docker, you will need to use docker-compose due to the naming convention in placed for serverless
#### Dev
1. `docker-compose -f docker-compose-dev.yml build`
2. `docker-compose -f docker-compose-dev.yml up`

#### Production
1. `docker-compose build`
2. `docker-compose up`

### Running the application
> To run the application with arguments

`npm run build`
`npm run start -- <arg>`

### Creating in Elastic Beanstalk
> Some files such as .ebignore allows you to push files that are ignored by .gitignore
> This is important fo EB deployments
1. Once EB is installed on your machine, make sure the AWS CLI is setup with your credentials
2. Use `EB init` (or `eb init -f` if you require reconfiguration) to set up the zone and application 
3. `EB create <environment>` to create the environment
4. `EB Deploy` to deploy the application to the environment

> There is some manual steps that you need to perform
5. `EB ssh` to go into the environment
6. `sudo bash` to run as root
7. Follow the steps in https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html 
to install node
8. Run cronatab with `crontab -e`

> Step 9 might differ depends on where node is installed.
> use `whereis node`
9. Copy what is in `docker-cron` into crontab

### Deployment Steps
1. docker build -t scrapy -f Dockerfile-aws .
2. docker tag scrapy:latest <unique>/scrapy:latest (this implementation is hosted in ECR)
3. docker push <unique>/scrapy:latest
4. eb deploy <environment name>

Source: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html

## Running serverless
### Deployment instructions

> **Requirements**: Docker. In order to build images locally and push them to ECR, you need to have Docker installed on your local machine. Please refer to [official documentation](https://docs.docker.com/get-docker/).

In order to deploy your service, run the following command

```
sls deploy
```

### Test your service

After successful deployment, you can test your service remotely by using the following command:

```
sls invoke --function hello
```

## References
- https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f
- https://www.serverless.com/blog/container-support-for-lambda
- https://www.proud2becloud.com/how-to-build-a-serverless-backend-with-typescript-nodejs-and-aws-lambda/
- https://www.serverless.com/blog/serverless-express-rest-api
- https://acloudguru.com/blog/engineering/serverless-browser-automation-with-aws-lambda-and-puppeteer
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html

## Licence
MIT


