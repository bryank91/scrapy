import fs from "fs"
import { FileTypes } from "data/fileTypes";
const fsPromises = fs.promises;

export namespace FileHandle {
    export async function writeFile(str: string, target: FileTypes.FilePath): Promise<void> {
        return await fsPromises.writeFile(target, str)
    }

    // read the file and return the path and the content
    export async function readFile(target: string): Promise<FileTypes.File> {

        const res = await fs.readFileSync(target,'utf8')

        return {
            Path: target,
            Content: res.toString()
        }
    }

    // compare the difference between the source and the target file
    export async function compare(source: FileTypes.File, target: FileTypes.File): Promise<boolean> {
        console.log(source)
        console.log(target)
        return (source.Content == target.Content) ? true : false
    }
}