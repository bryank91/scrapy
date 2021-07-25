import fs from "fs"
import { FileTypes } from "data/fileTypes";

export namespace FileHandle {
    export async function writeFile(str: string, target: FileTypes.FilePath): Promise<void> {
        await fs.writeFile(target, str, () => {
            console.log("Writing to file finished")
        })
    }

    // read the file and return the path and the content
    export async function readFile(target: string): Promise<FileTypes.File> {

        const res = await fs.readFileSync(target)

        return {
            Path: target,
            Content: res.toString()
        }
    }

    // compare the difference between the source and the target file
    export async function compare(source: string, target: FileTypes.File): Promise<boolean> {
        return false
    }
}