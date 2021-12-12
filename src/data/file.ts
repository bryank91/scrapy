import fs from "fs";

export namespace Data.File {
  export interface File {
    Path: string;
    Content: string;
  }

  export type FilePath = string;
  export type ContentType = string | null | undefined;

  // TODO: can use neverthrow in the future
  export class ResultFile {
    path: string | undefined;

    constructor(path: string) {
      this.path = fs.existsSync(path) ? path : undefined;
    }

    asString() {
      return this.path?.toString();
    }
  }
}
