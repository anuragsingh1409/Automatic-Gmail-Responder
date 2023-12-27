const { google } = require('googleapis');
const { authenticate } = require('./auth');

// Function to retrieve messages from the user's inbox
const retrieveMessages = async () => {
  const authClient = await authenticate();
  const gmailAPI = google.gmail({ version: 'v1', auth: authClient });

  try {
    const response = await gmailAPI.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
    });
    return response.data.messages || [];
  } catch (error) {
    throw new Error(`Error retrieving messages: ${error.message}`);
  }
}

// Function to send an automatic response for a given message ID
const sendAutomaticResponse = async (messageId) => {
  const authClient = await authenticate();
  const gmailAPI = google.gmail({ version: 'v1', auth: authClient });

  try {
    const messageData = await gmailAPI.users.messages.get({
      userId: 'me',
      id: messageId,
    });

    const headers = messageData.data.payload.headers;
    const senderHeader = headers.find((header) => header.name === 'From');
    const senderEmail = senderHeader ? senderHeader.value : undefined;
    const subjectHeader = headers.find(header => header.name === 'Subject');
    const emailSubject = subjectHeader ? subjectHeader.value : undefined;

    if (!senderEmail) { throw new Error('Sender email address not found in the message headers.'); }

    console.log("Sender Email: ", senderEmail);
    if (senderEmail.toLowerCase().includes('noreply') || senderEmail.toLowerCase().includes('no-reply')) {
      console.log(`Skipping automatic response for email with 'noreply' or 'no-reply' address: ${senderEmail}`);
      return;  // Skip sending the automatic response
    }

    const autoResponseMessage = `Thank you for your email. I'm currently on leave and will respond as I join again. Regards Anurag Singh`;

    await gmailAPI.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(
          `From: "Anurag Singh" <anuragsingh140901@gmail.com>\r\n` +
          `To: ${senderEmail}\r\n` +
          `Subject: Re: ${emailSubject}\r\n` +
          `\r\n` +
          `${autoResponseMessage}`
        ).toString('base64'),
      },
    });
  } catch (error) {
    throw new Error(`Error sending automatic response: ${error.message}`);
  }
}

// Function to fetch details about a Gmail thread using its ID
const fetchThreadDetails = async (threadId) => {
  const authClient = await authenticate();
  const gmailAPI = google.gmail({ version: 'v1', auth: authClient });

  try {
    const response = await gmailAPI.users.threads.get({
      userId: 'me',
      id: threadId,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching thread details: ${error.message}`);
  }
}

// Function to apply a label to a Gmail message
const applyLabel = async (messageId, labelName) => {
  try {
    const authClient = await authenticate();
    const gmailAPI = google.gmail({ version: 'v1', auth: authClient });
    const existingLabels = await gmailAPI.users.labels.list({
      userId: 'me',
    });
    const label = existingLabels.data.labels.find((l) => l.name === labelName);

    if (!label) {
      const createdLabel = await gmailAPI.users.labels.create({
        userId: 'me',
        requestBody: {
          name: labelName,
        },
      });
      labelName = createdLabel.data.id;
    } else {
      labelName = label.id;
    }
    // Apply the label to the message
    await gmailAPI.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: [labelName],
      },
    });
  } catch (error) {
    throw new Error(`Error applying label: ${error.message}`);
  }
};

module.exports = { retrieveMessages, sendAutomaticResponse, applyLabel, fetchThreadDetails };
