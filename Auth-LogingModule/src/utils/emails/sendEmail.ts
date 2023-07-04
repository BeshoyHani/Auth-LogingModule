import Logger from '../../config/logger';
import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transport = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        const options = () => {
            return {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: subject,
                html: template,
            };
        };

        // Send email
        transport.sendMail(options(), (error, info) => {
            if (error) {
                throw new Error(error.message);
            } else {
                Logger.info(info);
            }
        });
        return true;
    } catch (error) {
        Logger.error(error);
        return false;
    }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

export default sendEmail;