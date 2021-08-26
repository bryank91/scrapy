import { text } from "express";
import { Browser, ConsoleMessage, Page } from "puppeteer-core"
import { Data as Config } from "../../data/config"
import { html } from "../actions/html"
import { Shared } from "../actions/shared"

declare const window: any;

export namespace GoogleForms {
    export async function autofill() {
        const googleFormsLink = "https://docs.google.com/forms/d/e/1FAIpQLSfV2MwCb991QKe4bIzpifWluvyVnegzRsw49gbe5DoFLYn_Ew/viewform?embedded=true"

        let browser = await Shared.initBrowser()
        let page = await html.navigate(googleFormsLink, browser)

        const textSelectors = 'input[type="text"]'
        const radioSelctors = 'div[aria-checked="false"]'
        const inputAreaSelector = '.quantumWizTextinputPaperinputInputArea'

        page.waitForSelector(textSelectors)
        let textInputs = await page.$$(textSelectors)
        await textInputs.forEach((e) => {
            e.type('this is a test')
        })

        // await browser.close()

        return 0
    }
}
