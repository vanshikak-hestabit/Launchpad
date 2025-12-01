const { Worker } = require('bullmq');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
require('dotenv').config(); // make sure env is loaded

console.log(process.env.EMAIL_USER)

const connection = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesRequest:null,
  enableReadyCheck:false
};

// Create nodemailer transporter using env
const transporter = nodemailer.createTransport({
  service:"gmail", 
  auth: {
    user: "vanshikavk.khandelwal@gmail.com",
    pass: "tkgy pxtt ttwb ivlk"
  },
});

const worker = new Worker(
  'emailQueue',
  async job => {
    logger.info(`[${job.id}] Processing email to ${job.data.to}`);
    // Send real email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: job.data.to,
      subject: job.data.subject,
      text: job.data.body,
    });
    logger.info(`[${job.id}] Email sent to ${job.data.to} with subject: ${job.data.subject}`);
    return { success: true };
  },
  { connection }
);

worker.on('completed', job => {
  logger.info(`[${job.id}] Job completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`[${job.id}] Job failed: ${err.message}`);
});

console.log('Email worker started and listening for jobs...');
