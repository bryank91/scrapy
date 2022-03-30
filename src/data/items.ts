export namespace Items {

    interface Item {
        name: string,
        altName?: string,
        url: string,
        status?: string | null
    }

    // using newline as a enumeration, returns the difference in the two arrays as an array of strings
    export function compareTwoArraysWithNewLineEnumeration(fi: string, si: string) : string[] {
        return fi.split("\n").filter((x) => !si.split("\n").includes(x))
    }
}
