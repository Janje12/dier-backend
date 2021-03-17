require('dotenv').config();
const fs = require('fs');
const mailer = require('nodemailer');
const userController = require('./user.controller');
const handlebars = require('handlebars');

exports.generateTransporter = function () {
    const transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    return transporter;
};

exports.sendMailVerification = async (user) => {
    try {
        let transporter = this.generateTransporter();
        const hostLink = process.env.NODE_ENV ? 'https://dier-backend.herokuapp.com/api/mail/verify/' :
            'http://localhost:3000/api/mail/verify/';
        const userLink = hostLink + user.verificationToken;
        fs.readFile('./mail_templates/verify-user.html', async (err, data) => {
            if (err) {
                throw err(err);
            }
            const template = handlebars.compile(data.toString());
            const html = template({firstName: user.firstName, lastName: user.lastName, userLink: userLink});
            const info = await transporter.sendMail({
                from: '"DIER APP" <' + 'process.env.MAIL_USERNAME' + '>', // sender address
                to: user.email, // list of receivers
                subject: 'Aktiviraj nalog', // Subject line
                text: 'Aktiviraj nalog, link: ' + userLink, // plain text body
                html: html, // html body
            });
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

exports.sendMailResetPassword = async (user) => {
    try {
        let transporter = this.generateTransporter();
        const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/reset-password?token=' :
            'http://localhost:4200/auth/reset-password?token=';
        const userLink = hostLink + user.passResetToken;
        fs.readFile('./mail_templates/reset-password.html', async (err, data) => {
            if (err) {
                throw err(err);
            }
            const template = handlebars.compile(data.toString());
            const html = template({firstName: user.firstName, lastName: user.lastName, userLink: userLink});
            const info = await transporter.sendMail({
                from: '"DIER APP" <' + 'process.env.MAIL_USERNAME' + '>', // sender address
                to: user.email, // list of receivers
                subject: 'Zaboravljenja lozinka', // Subject line
                text: 'Zaboravljenja lozinka, link: ' + userLink, // plain text body
                html: html, // html body
            });
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

exports.verify = async (req, res) => {
    if (!req.params.verificationToken) {
        res.sendStatus(401);
        return;
    }
    const verificationToken = req.params.verificationToken;
    try {
        const user = await userController.readOneMethod({'verificationToken': verificationToken});
        if (user !== null) {
            user.verified = true;
            user.verificationToken = '';
            await userController.updateOneMethod({'_id': user._id}, user, {$unset: {verificationToken: ''}});
            const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/email-confirm' :
                'http://localhost:4200/auth/email-confirm';
            res.redirect(hostLink);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.contact = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.message || !req.body.title) {
        res.sendStatus(400);
        return;
    }
    const title = req.body.title;
    const message = req.body.message;
    const username = req.body.username;
    const email = req.body.email;
    try {
        let transporter = this.generateTransporter();
        const info = await transporter.sendMail({
            from: '"DIER APP" <abelink10@gmail.com>', // sender address
            to: 'serbiansolutions@gmail.com', // list of receivers
            subject: '[BUG REPORT] ' + title, // Subject line
            text: 'OD: ' + username + '\nPORUKA: ' + message + '\nEMAIL ZA KONTAKT: ' + email, // plain text body
        });
        res.send(200).json(true);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};
