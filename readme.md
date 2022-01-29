# Scrapy
## Description
Puppeteer scraping tool with multiple features. Currently built to run with Docker, Node and 
Serverless (preview). Can be run as an express HTTP server or a CLI command

Supported sites
- Shopify

---

## Pre-requisites
- Node 16 (use nvm)
- Python 3.7.2 (https://www.python.org/downloads/) or use (brew install pyenv)
- AWS CLI (https://aws.amazon.com/cli/)
- EB CLI (https://github.com/aws/aws-elastic-beanstalk-cli-setup)
- Postgresql

## Configuration
Ensure this is performed before any of the task
1. Set up your environment. Copy .env.example to .env and configure your ports and profiles you want to use
2. To configure profiles, copy discord.example.json to discord.json and configure your profiles
3. To configure headers for puppeteer, copy headers.example.json to headers.json and configure the headers

### Database Setup
``` Under the assumption postgresql is setup ```
1. `npm install pg --save`
2. `npx sequelize-cli db:create`
3. `npx sequelize-cli db:migrate`

## Running in Docker and Development
### Local Development
> This runs as nodemon which allows watch
1. `npm install`
2. `npm run build`
3. `npm run start -- --help`
4. `npm run start -- <arg>`

``` 
You might need to force install chromium for fresh installations using "node node_modules/puppeteer-core/install.js" 
```

### Running the application
> To run the application with arguments

`npm run build`
`npm run start -- <arg>`

> When working with puppeteer-cluster, its good to develop this in debug mode
in linux
` export DEBUG='puppeteer-cluster:*' `
or in windows
` set export DEBUG='puppeteer-cluster:*' `

> When debugging the application, you can use debugger
`set NODE_INSPECT_RESUME_ON_START=1` 
Set the `debugger;` in your script where you want the breakpoint to stop
Use the debugger tool in VS code to run with `debugger`
You can also set breakpoints in the *built* scripts 

### Working with database items
> To create, read, update or delete database records, run the following commands or refer to --help

The first argument refers to a database action, the 2nd argument refers to the model. Ensure the data is in a correct JSON string format that matches the respective model.

`npm run start db findOne discordWebhooks 1`

`npm run start db findAll discordWebhooks`

`npm run start db create discordWebhooks '{"name":"tname", "webhookId": "tid", "webhookToken": "ttoken" }'`

`npm run start db update discordWebhooks 1 '{"name":"newname" }'`

`npm run start db delete discordWebhooks 1`

### Running in docker
> To run this in docker, you will need to use docker-compose due to the naming convention in placed for serverless
#### Dev
1. `docker-compose -f docker-compose-dev.yml build`
2. `docker-compose -f docker-compose-dev.yml up`

#### Production
1. `docker-compose build`
2. `docker-compose up`

---

## Azure
## Create in Ubuntu VM 

Clone the repository 

`git clone https://github.com/bryank91/scrapy.git`

Run the initializer shell to build all the depedencies 

`./init.sh`

Create json files for headers, errors and discord. Example files provided

Build the project 

`npm run build`

Run the project with 

`npm run start -- --help`

> If you run into errors in regards to running the start command (eg. ???), run  `. ~/.nvm/nvm.sh && nvm install node`

> In certain cases, you might not be able to build. you will need to delete node_modules, downgrade npm and npm install

To enhance reliability of the application, it is recommended to add the process_monitor.sh into crontab

In `cronjob.env.sh` change `[user]` to your home directory name 

`crontab -e`

Add this into crontab 

```
*/1 * * * *     (. /home/[user]/scrapy/cronjob.env.sh; /home/[user]/scrapy/scripts/process_monitor.sh <directory> <command> >> /home/[user]/cron.log; )
```

Sample directory
```
"/home/[user]/scrapy"
```

Sample command
```
"changes profile1 --forever 30"
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

## References
- https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f
- https://www.serverless.com/blog/container-support-for-lambda
- https://www.proud2becloud.com/how-to-build-a-serverless-backend-with-typescript-nodejs-and-aws-lambda/
- https://www.serverless.com/blog/serverless-express-rest-api
- https://acloudguru.com/blog/engineering/serverless-browser-automation-with-aws-lambda-and-puppeteer
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html

## Licence
MIT

## FAQ

1. Getting this error: Error: Unable to launch browser, error message: Could not find expected browser (chrome) locally. What do i do?
> node node_modules/puppeteer-core/install.js
2. How do I debug puppeteer-cluster?
> In linux
` export DEBUG='puppeteer-cluster:*' `
> In windows
` set export DEBUG='puppeteer-cluster:*' `


