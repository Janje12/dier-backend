require('dotenv').config();
const mailer = require('nodemailer');
const userController = require('./user.controller');

exports.generateTransporter = function() {
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
        const info = await transporter.sendMail({
            from: '"DIER APP" <abelink10@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Verifikacija', // Subject line
            text: 'Verifikujte se?', // plain text body
            html: `<a href="${userLink}"><button>Verifikuj se!</button></a>`, // html body
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
        const info = await transporter.sendMail({
            from: '"DIER APP" <abelink10@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Zaboravljenja lozinka', // Subject line
            text: 'Zaboravljnja lozinka', // plain text body
            html: `Da bi ste promenili lozinu kliknite <a href="${userLink}">ovde</a>!`, // html body
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
