import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
export const fbconfig = {
  facebook_api_key: process.env.facebook_api_key,
  facebook_api_secret: process.env.facebook_api_secret,
  callback_url: process.env.callback_url,
  use_database: true,
  host: "localhost",
  username: "root",
  database: "facebook",
  profileFields: ["emails", "name"],
};
