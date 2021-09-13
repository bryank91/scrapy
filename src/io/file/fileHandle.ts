import fs from "fs"
import { Data } from "data/file";
const fsPromises = fs.promises;

export namespace FileHandle {

    // checks if the file exist
    export async function checkFileExist(target: string): Promise<boolean> {
        return fs.existsSync(target)
    }

    // writes the content to target file
    export async function writeFile(content: Data.File.ContentType, target: Data.File.FilePath): Promise<void> {
        let safeContent = content == null || undefined ? "" : content
        return await fsPromises.writeFile(target, safeContent)
    }

    // read the file and return the path and the content
    // if it does not exist, creates the file
    export async function readFile(target: string): Promise<Data.File.File> {

        async function readFileHelper() {
            if (fs.existsSync(target)) {
                return await fs.readFileSync(target, 'utf8')
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
    // returns true if similar else false
    export async function compare(source: Data.File.File, target: Data.File.File): Promise<boolean> {
        return (source.Content == target.Content) ? true : false
    }

    // if disimilar, returns the differences between 2 files
    export async function compareWithDifferences() {
        // TODO
    }

    // compare differences with 2 arrays of objects of the same types
    // as you can't compare objects correctly 
    export async function compareObjects<T>(source: T[], target: T[]): Promise<T[]> {
        let sourceString = source.map(e => JSON.stringify(e))
        let targetString = target.map(e => JSON.stringify(e))
        let res = sourceString.filter(x => !targetString.includes(x))
        return res.map(e => JSON.parse(e))
    }
}