const express = require('express');
const { retrieveMessages, sendAutomaticResponse, applyLabel, fetchThreadDetails } = require('./main');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const messages = await retrieveMessages();
    for (const message of messages) {
      const messageId = message.id;
      if (await hasNoReplies(messageId) === false) {
        await sendAutomaticResponse(messageId);
        await applyLabel(messageId, 'Holiday');
      }
    }

    res.send('Processing completed.');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Function to check if a message has no replies
const hasNoReplies = async (messageId) => {
  const threadId = (await retrieveMessages(messageId))[0].threadId;
  const thread = await fetchThreadDetails(threadId);


  if (Array.isArray(thread.messages) && thread.messages.length > 0) {
    if (thread.messages[0].labelIds.includes('SENT') || thread.messages[0].labelIds.includes('Holiday')) {
      return true;
    }
  }

  return false;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    runServer();
  });
//runs the app in random interval of 45-120seconds
const runServer = async () => {
    setInterval(async () => {
        try {
          const messages = await retrieveMessages();
          for (const message of messages) {
            const messageId = message.id;
            if (await hasNoReplies(messageId) === false) {
              await sendAutomaticResponse(messageId);
              await applyLabel(messageId, 'Holiday');
            }
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
}

