const { Queue } = require('bullmq');
const logger = require('../utils/logger');


const emailQueue = new Queue('emailQueue', {
  connection: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined,
});

function addEmailJob(to, subject, body) {
  return emailQueue.add('sendEmail', { to, subject, body }, {
    attempts: 1,         // retry 3 times
    backoff: 5000,       // wait 5s before retry
  });
}

module.exports = { emailQueue, addEmailJob };
