import fs from "fs"
import { FileTypes } from "data/fileTypes";
const fsPromises = fs.promises;

export namespace FileHandle {
    // writes the content to target file
    export async function writeFile(content: FileTypes.ContentType, target: FileTypes.FilePath): Promise<void> {
        let safeContent = content == null || undefined ? "" : content
        return await fsPromises.writeFile(target, safeContent)
    }

    // read the file and return the path and the content
    // if it does not exist, creates the file
    export async function readFile(target: string): Promise<FileTypes.File> {
        
        async function readFileHelper() {
            if (fs.existsSync(target)) {
                return await fs.readFileSync(target,'utf8')
            } else {
                console.log('File does not exist. Creating file...')
                await writeFile("", target)
                return "" // writes an empty string to the file
            }
        }

        const res = await readFileHelper();

        return {
            Path: target,
            Content: res.toString()
        }
    }

    // compare the difference between the source and the target file
    export async function compare(source: FileTypes.File, target: FileTypes.File): Promise<boolean> {
        return (source.Content == target.Content) ? true : false
    }
}