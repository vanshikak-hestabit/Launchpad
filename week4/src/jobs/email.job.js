const { Queue } = require('bullmq');
const logger = require('../utils/logger');


const emailQueue = new Queue('emailQueue', {
  connection: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined,
});

function addEmailJob(to, subject, body) {
  return emailQueue.add('sendEmail', { to, subject, body }, {
    attempts: 2,         // retry 2 times
    backoff: 5000,       // wait 5s before retry
  });
}

module.exports = { emailQueue, addEmailJob };

// this files pushes jobs into queue
// it does not send mails it just creates a job and puts it inside redis queue
// maked a function addEmailJob so that app can use and send email