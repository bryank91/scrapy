# Scrapy
## Description
Puppeteer scraping tool with multiple features. Currently built to run with Docker, Node and 
Serverless. Can be run as an express HTTP server or a CLI command

Supported sites
- Shopify

---

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
1. Running postgresql using docker
`docker run --name postgresql -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres`

2. `npm install pg --save`
3. `npx sequelize-cli db:create`

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

---

## Azure
## Create in Ubuntu VM 

Clone the repository 

`git clone https://github.com/bryank91/scrapy.git`

Run the initializer shell to build all the depedencies 

`./init.sh`

Create json files for headers, errors and discord

Build the project 

`npm run build`

Run the project with 

`npm run start -- --help`

> If you run into errors in regards to running the start command (eg. ???), run  `. ~/.nvm/nvm.sh && nvm install node`

To enhance reliability of the application, it is recommended to add the process_monitor.sh into crontab

`crontab -e`
```
# Add this into crontab -e
* * * * * /usr/bin/bash /home/bryan/scrapy/scripts/process_monitor.sh 10 testing >> /var/log/cron.log 2>&1
```


### Create App Service Steps
1. `az login` (pre-req you have Azure installed)
2. Create Resource Group in AU 
`az group create --name Scrapy --location "Australia Southeast"` (depending on the location you prefer)
3. Create appservice plan 
`az appservice plan create --name scrapy --resource-group Scrapy --sku B1 --is-linux`
4. App deployment with docker-compose 
`az webapp create --resource-group Scrapy --plan scrapy --name scrapy --multicontainer-config-type compose --multicontainer-config-file docker-compose-prod.yml`
5. Gets the identity of the webapp 
`az webapp identity assign --resource-group Scrapy --name scrapy --query principalId --output tsv`
6. Gets the subscrption id 
`az account show --query id --output tsv`
7. With the crendentials above
`az role assignment create --assignee <principal-id> --scope /subscriptions/<subscription-id>/resourceGroups/<myResourceGroup>/providers/Microsoft.ContainerRegistry/registries/<registry-name> --role "AcrPull"`
8. `<principal-id>` is from step 5, `<registry-name>` is scrapy, `<subscription-id>` from from step 6, `<myResourceGroup>` is Scrapy
9. Update the RG permissions 
`az resource update --ids /subscriptions/<subscription-id>/resourceGroups/<myResourceGroup>/providers/Microsoft.Web/sites/<app-name>/config/web --set properties.acrUseManagedIdentityCreds=True`
9. `<subscription-id>` is from step 6, `<myResourceGroup>` is Scrapy, `<app-name>` is scrapy
10. You will need to try to access the site to trigger the docker-compose pull

Source: https://docs.microsoft.com/en-us/azure/app-service/tutorial-custom-container?pivots=container-linux

Pushing to ACR
1. `az acr create --name scrapy --resource-group Scrapy --sku standard`
2. `docker login scrapy.azurecr.io`
3. `docker build -f Dockerfile-azure --tag scrapy:latest .`
4. `docker tag scrapy scrapy.azurecr.io/scrapy`

To remove:
1. `az webapp delete --name scrapy --resource-group Scrapy` (to remove after testing)

To SSH (not working atm):
1. Configure: https://docs.microsoft.com/en-au/azure/app-service/configure-linux-open-ssh-session
2.  `az webapp ssh --name scrapy --resource-group Scrapy`

To see logs:
1. `az webapp loconfig --name scrapy --resource-group Scrapy --docker-container-logging filesystem`
2. `az webapp log tail --name scrapy --resource-group Scrapy`

---

## AWS (Deprecated)
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
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
```

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

---

## Running serverless (Preview)
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


