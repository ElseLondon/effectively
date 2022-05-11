# Effectively
## Origin
This app is based off the Twilio React Video Chat Application linked here: https://github.com/twilio/twilio-video-app-react. The complete instructions for the boilerplate are also there.

## Architecture
It is a React App by nature, with a simple serverless back-end. All deployment is handled by Twilio.
This application requires an access token to connect to a Room for Video and a Conversation for Chat. The included local token [server](server/index.ts) provides the application with access tokens. This token server can be used to run the app locally, and it is the server that is used when this app is run in development mode with `npm start`.

## Features
- [x] Video conferencing with real-time video and audio
- [x] Chat support for textual and file-based messaging
- [x] Enable/disable camera
- [x] Mute/unmute mic
- [x] Screen sharing
- [x] [Dominant speaker](https://www.twilio.com/docs/video/detecting-dominant-speaker) indicator
- [x] [Network quality](https://www.twilio.com/docs/video/using-network-quality-api) indicator
- [x] Defines participant bandwidth usage with the [Bandwidth Profile API](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api)
- [x] Start and stop recording with the [Recording Rules API](https://www.twilio.com/docs/video/api/recording-rules)

## How to Run Locally
Run the app locally with

    npm start

This will start the local token server and run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console. Start the token server locally with

    npm run server

The token server runs on port 8081 and expects a `POST` request at the `/token` route with the following JSON parameters:

```
{
  "user_identity": string, // the user's identity
  "room_name": string, // the room name
}
```

The response will be a token that can be used to connect to a room. The server provided with this application uses the same endpoints as the [plugin-rtc](https://github.com/twilio-labs/plugin-rtc) Twilio CLI plugin that is used to deploy the app. For more detailed information on the server endpoints, please see the [plugin-rtc README](https://github.com/twilio-labs/plugin-rtc#twilio-labsplugin-rtc).

## Tests
This application has unit tests (using [Jest](https://jestjs.io/)) and end-to-end tests (using [Cypress](https://www.cypress.io/)). You can run the tests with the following scripts.

#### Unit Tests
Run unit tests with

    npm test

This will run all unit tests with Jest and output the results to the console.

#### E2E Tests
Run end to end tests with

    npm run cypress:open

This will open the Cypress test runner. When it's open, select a test file to run.

**Note:** Be sure to complete the 'Getting Started' section before running these tests. These Cypress tests will connect to real Twilio rooms and real Twilio conversations, so you may be billed for any time that is used.

## Deploy the app to Twilio
Before deploying the app, make sure you are using the correct account on the Twilio CLI (using the command `twilio profiles:list` to check).
The app is deployed to Twilio with a single command:

    npm run deploy:twilio-cli

If the app has already been deployed, use the following command to override it:

    npm run deploy:twilio-cli -- --override

This performs the following steps:

- Builds the React app in the `src` directory
- Generates a random code used to access the Video app
- Deploys the React app and token server function as a Twilio Serverless service.
- Prints the URL for the app and the passcode.