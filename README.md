### OVERVIEW
This Node.js application automates the process of responding to emails in the user's Gmail inbox with a predefined message and applies a specific label to those emails. 

## FOLDER STRUCTURE

- **index.js-** This file serves as the entry point for the Node.js application. It uses the Express.js framework to create a web server. 

- **main.js-** This file contains the main logic for interacting with the Gmail API. It includes functions for retrieving messages, sending automatic responses, fetching thread details, and applying labels.

- **auth.js-** This file handles authentication with the Gmail API using OAuth2. It uses the credentials stored in the environment variables.

- **.env-** This file stores sensitive information such as the client ID, client secret, redirect URI, and refresh token.

## Prerequisites

- Gmail API credentials from the [Google Developer Console](https://console.developers.google.com/).

## GETTING STARTED

1. Clone the repository
   git clone https://github.com/anuragsingh1409/OpeninApp-Assignment.git

2. Install dependencies 
   npm install

3. Set up .env file
    -**CLIENT_ID=your_client_id**
    -**CLEINT_SECRET=your_client_secret**
    -**REDIRECT_URI=your_redirect_uri**
    -**REFRESH_TOKEN=your_refresh_token**

4. Run the application
    nodemon index.js or node index.js

## NOTE
    Ensure that the Gmail API is enabled for your Google Cloud project, and the necessary credentials are set up.
