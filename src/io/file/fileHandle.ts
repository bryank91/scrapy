import fs from "fs"
import { FileTypes } from "data/fileTypes";

export namespace FileHandle {
    export async function writeFile(str: string, target: FileTypes.File) {

        if (target.path == undefined) {
            throw "Invalid file source. Exiting program..."
        } else {
            // TODO: use neverthrow, this is hacky
            const parsedTarget = target.asString()
            fs.writeFile(parsedTarget, str, () => {
                console.log("Writing to file finished")
            })
        }
    }
}