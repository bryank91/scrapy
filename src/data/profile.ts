export namespace Data.Profile {
  export interface ChangeProfile {
    url: string;
    selector: string;
    file: string;
    webhook: {
      id: string;
      token: string;
    };
    footer: string;
    title: string;
  }
}
