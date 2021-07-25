import fs from 'fs'

export namespace FileTypes {

    // TODO: can use neverthrow in the future
    export class File {

        path: string | undefined

        constructor(path: string) {
            this.path = fs.existsSync(path) ? path : undefined
        }

        asString() {
            return this.path!.toString()
        }
    }
}