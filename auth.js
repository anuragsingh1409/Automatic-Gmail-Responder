
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);

const authenticate = async () => {
  try {
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    return oAuth2Client;
  } catch (error) {
    return error;
  }
};

module.exports = { authenticate };