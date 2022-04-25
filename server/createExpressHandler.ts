import 'dotenv/config';
import { Request, Response } from 'express';
import { ServerlessContext, ServerlessFunction } from './types';
import Twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  TWILIO_CONVERSATIONS_SERVICE_SID,
  REACT_APP_TWILIO_ENVIRONMENT,
} = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
  region: REACT_APP_TWILIO_ENVIRONMENT === 'prod' ? undefined : REACT_APP_TWILIO_ENVIRONMENT,
});

const context: ServerlessContext = {
  ACCOUNT_SID: TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  ROOM_TYPE: 'group',
  CONVERSATIONS_SERVICE_SID: TWILIO_CONVERSATIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

export function createExpressHandler(serverlessFunction: ServerlessFunction) {
  return (req: Request, res: Response) => {
    // 
    // Get Room Details from req.body
    // store them in local memory somehow (or use DB if necessary)
    // For next token fetch, if named room has Room Details, return them as well?
    // Could create a separate endpoint for checking whether a room has rules 
    console.log("REQUEST BODY:", req.body);
    // 
    serverlessFunction(context, req.body, (_, serverlessResponse) => {
      const { statusCode, headers, body } = serverlessResponse;

      res
        .status(statusCode)
        .set(headers)
        .json(body);
    });
  };
}
