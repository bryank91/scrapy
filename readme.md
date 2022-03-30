# Scrapy
## Description
Puppeteer scraping tool with multiple features. Currently built to run with Docker, Node and 
Serverless (preview). Can be run as an express HTTP server or a CLI command

## Pre-requisites
- Node 16 (use nvm)
- Python 3.7.2 (https://www.python.org/downloads/) or use (brew install pyenv)
- Postgresql
- 2 VCPU machine, 1 GB of ram (will differ depend on your cluster configuration)

## Configuration
Ensure this is performed before any of the task. Refer to the .json.example for samples of configuration
```
Discord notifier = discord.json
Headers in request = headers.json
Configs for database = configs.json
Cluster configuration = cluster.json
Profiles for bot = profiles.json
Sites bot configuration = sites.json
Error Discord logging = error.json
```

### Database Setup
``` Under the assumption postgresql is setup ```
1. `npm install pg --save`
2. `npx sequelize-cli db:create`
3. `npx sequelize-cli db:migrate`

## Running in Docker and Development
### Local Development
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

```
npm run start db findOne discordWebhooks 1
npm run start db findAll discordWebhooks
npm run start db create discordWebhooks '{"name":"tname", "webhookId": "tid", "webhookToken": "token" }'
npm run start db update discordWebhooks 1 '{"name":"newname" }'
npm run start db delete discordWebhooks 1
```

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

### Using PM2
1. `npm install pm2@latest -g`
2. Start setting up applications eg. `pm2 start build/index.js --name apple --watch -- shopify profile --forever 60 apple`
3. To edit existing applications `pm2 restart <name> --max-memory-restart 700M`
4. Use `pm2 monit` for monitoring
Full guide available here: https://pm2.keymetrics.io/docs/usage/quick-start/

## Running in docker (Untested)
> To run this in docker, you will need to use docker-compose due to the naming convention in placed for serverless
#### Dev
1. `docker-compose -f docker-compose-dev.yml build`
2. `docker-compose -f docker-compose-dev.yml up`

#### Production
1. `docker-compose build`
2. `docker-compose up`

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

3. Why does it crash after awhile with errors such as target not found
> There is currently a bug at the moment where if CPU usage is 100%, it does not recover properly


