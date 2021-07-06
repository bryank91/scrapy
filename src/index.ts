const puppeteer = require('puppeteer');
import { Commands } from "./io/commands/commands"
import { Actions } from "./io/actions/navigate"

const command = new Commands
const actions = command.parse(process.argv);
const navigate = new Actions.Navigate
const page = navigate.launch()
