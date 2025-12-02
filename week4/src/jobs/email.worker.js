const { Worker } = require('bullmq');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

console.log(process.env.EMAIL_USER)

// connect worker to redis
const connection = {
  host: '127.0.0.1',
  port: 6379,  // redis port
  // maxRetriesRequest:null,
  // enableReadyCheck:false
};

// Create nodemailer transporter using env
const transporter = nodemailer.createTransport({
  service:"gmail", 
  auth: {
    user: "vanshikavk.khandelwal@gmail.com",
    pass: "tkgy pxtt ttwb ivlk"
  },
});

// create a worker (worker name=queue name)
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

// this file picks the jobs from queue made by email.job.js and executes them
