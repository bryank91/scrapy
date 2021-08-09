export namespace Data.Profile {

    export type ChangeProfile = {
        url: string
        selector: string
        file: string
        webhook: {
            id: string
            token: string
        }
        footer: string
        title: string
    }
}