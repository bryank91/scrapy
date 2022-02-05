export namespace Profiles {
  export const Profile = require("../../config/profiles.json");

  export interface Details {
    firstName: string;
    lastName: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    phone: string;
  }

  export interface Payment {
    name: string;
    cardNumber: string;
    exp: string;
    cvv: string;
  }

  export interface Profile {
    details: Details;
    payment: Payment;
  }
}
