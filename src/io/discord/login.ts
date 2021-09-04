import { Browser, Page } from "puppeteer-core"
import { Data as Config } from "../../data/config"
import { html } from "../actions/html"
import { Shared } from "../actions/shared"

declare const window: any;

export namespace Discord {
    export async function login() {
        let browser = await Shared.initBrowser()
        let pageData = await html.navigate("https://discord.com/login", browser)
        let page = await pageData.Page

        const emailSelector = 'input[aria-label="Email or phone number"]';
        const passwordSelector = 'input[aria-label="Password"]';
        const submitButtonsSelector = 'button[type="submit"]';
        const dcIcon = 'div[aria-label=" Daily Clack"]'
        const wtsLink = 'a[aria-label="market-wts-wtt-no-chats (text channel)"]'


        // lets check which page are we in first if we do save the sesh
        await page.waitForTimeout(5000)

        const emailHandle = await page.$(emailSelector);

        if (emailHandle != null) {
            await console.log('Entering email')
            await emailHandle!.click();
            await emailHandle!.focus();
            await page.waitForSelector(emailSelector);
            await page.type(emailSelector, 'bryankph2@gmail.com', {
                delay: 10
            });

            await console.log('Entering password')
            const passwordHandle = await page.$(passwordSelector);
            await passwordHandle!.click();
            await passwordHandle!.focus();
            await page.waitForSelector(passwordSelector);
            await page.type(passwordSelector, 'thinkshiko90', {
                delay: 10
            });

            await console.log('Submitting')
            const submitHandle = await page.$(submitButtonsSelector)
            await page.waitForSelector(submitButtonsSelector);
            await submitHandle!.click();

        }

        await console.log('Waiting for page...')
        await page.waitForTimeout(5000)

        await page.waitForSelector(dcIcon);
        // const dcIconHandle = await page.$(dcIcon)
        const dcHandle =
            await page.evaluate(function () {
                let el: HTMLElement = document.querySelector('div[aria-label=" Daily Clack"]')!
                el.click()
            })

        /*
        const hrefDcIcon = await page.evaluate( function () {
            return document.querySelector('div[aria-label=" Daily Clack"]')!.getAttribute('href')
        })
        

        page = await browser.newPage() // replace page with new page
        await page.goto('https://discord.com/' + hrefDcIcon)          
        await page.waitForNavigation()

        */

        await page.waitForTimeout(5000)

        const wtsHandle = await page.$(wtsLink)
        await page.waitForSelector(wtsLink);
        wtsHandle!.click()

        await page.waitForTimeout(5000)
        let source = await page.content()

        console.log(source)

        await browser.close()

        return 0
    }
}
