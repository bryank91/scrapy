import fs from "fs"
import { FileTypes } from "data/fileTypes";

export namespace FileHandle {
    export async function writeFile(str: string, target: string) {

        fs.writeFile(target, str, () => {
            console.log("Writing to file finished")
        })
    }
}