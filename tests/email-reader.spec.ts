import { test } from '@playwright/test';
import { authorize, getMessageContentAsHTML } from './helpers/GmailHelper';

test.describe('Check we can read email content given email subject @regression', () => {
  test('test we can read email', async () => {
    const emailQueryParam = 'subject: Test Email from Julie';
    // emailAddress = emailAddress.replace('@gmail.com', '')
    // Authorize a client with credentials, then call the Gmail API.
    const auth = await authorize();
    const content = await getMessageContentAsHTML(auth, emailQueryParam);
    console.log(`found messages: ${content}`);
  });
});
