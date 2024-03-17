const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const dotenv = require('dotenv').config();

const app = express();

// Load JSON data from file
const jsonData = require('./mail.js');

// OAuth2 configuration
const OAuth2Client = new google.auth.OAuth2(
    process.env.ID,
    process.env.Sec,
    'https://developers.google.com/oauthplayground'
);

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH
});

// Create Nodemailer transporter using OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.ID,
        clientSecret: process.env.Sec,
        refreshToken: process.env.REFRESH,
        accessToken: OAuth2Client.getAccessToken()
    }
});

// Function to send email
const sendEmail = (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Endpoint to trigger sending emails
app.get('/sendEmails', (req, res) => {
    jsonData.emails.forEach(emailObj => {
        const to = emailObj.email;
        const teamLeadName = emailObj.data.teamLeadName; // Assuming 'teamLeadName' is a dynamic detail
        const subject = `Hello ${teamLeadName}, regarding your team's progress`;
        const html = `<p>Dear ${teamLeadName},</p>
                  <p>This is an automated email regarding your team's progress.</p>
                  <p>Please find the details below:</p>
                  <p>${emailObj.data.details}</p>
                  <p>Regards,</p>
                  <p>Your Name</p>`; // Update 'Your Name' accordingly

        sendEmail(to, subject, html);
    });

    res.send('Emails sent successfully');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
