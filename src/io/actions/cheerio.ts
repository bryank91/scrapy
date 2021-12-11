import { Shared } from "../actions/shared"
import { Data as Config } from "data/config"
import { Discord } from '../discord/webhook'
import axios, { AxiosResponse } from 'axios'

const cheerio = require('cheerio')

export namespace Cheerio {

    export function doGetDifference(profiles: any[], forceNotify: boolean = false): void {

        profiles.forEach(profile => {
            console.log(Config.headers)
            try {
                axios.get(profile.url, { headers: Config.headers, timeout: 30000 }).then((response) => {
                    console.log('With Selector: ' + profile.selector)
                    getSelector(response,Config.discord.selector)
                    return 1
                }).catch(e => {
                    console.log('Error in axios: ' + e) //possibly selector does not exist..
                })
            } catch (e) {
                console.log("Error parsing the profile")
            } finally {
                return 1
            }
        });
    }

    function getSelector(response: AxiosResponse<any>, selector:string) : string {
        let $ = cheerio.load(response.data)
        $(selector).text()
        console.log($)
        $(selector).each(function (i:any,el:any) {
            console.log('found el')
        })
        
        return "1"
    }


}
