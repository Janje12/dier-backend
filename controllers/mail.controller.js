require('dotenv').config();
const fs = require('fs');
const mailer = require('nodemailer');
const userController = require('./user.controller');
const permitController = require('./permit.controller');
const handlebars = require('handlebars');

exports.generateTransporter = function () {
    return mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
};

exports.sendMailVerification = async (user) => {
    try {
        let transporter = this.generateTransporter();
        const hostLink = process.env.NODE_ENV ? 'https://dier-backend.herokuapp.com/api/mail/verify/' :
            'http://localhost:3000/api/mail/verify/';
        const userLink = hostLink + user.verificationToken;
        fs.readFile('./mail_templates/verify-user.html', async (err, data) => {
            if (err) {
                throw new err;
            }
            const template = handlebars.compile(data.toString());
            const html = template({firstName: user.firstName, lastName: user.lastName, userLink: userLink});
            const info = await transporter.sendMail({
                from: '"DIER APP" <' + 'process.env.MAIL_USERNAME' + '>', // sender address
                to: user.email, // list of receivers
                subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
                text: 'Aktiviraj nalog, link: ' + userLink, // plain text body
                html: html, // html body
            });
            if (info.rejected.length > 0) {
                return false;
            }
        });
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

exports.sendMailResetPassword = async (user, token) => {
    try {
        let transporter = this.generateTransporter();
        const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/reset-password?token=' :
            'http://localhost:4200/auth/reset-password?token=';
        const userLink = hostLink + token;
        fs.readFile('./mail_templates/reset-password.html', async (err, data) => {
            if (err) {
                throw err(err);
            }
            const template = handlebars.compile(data.toString());
            const html = template({firstName: user.firstName, lastName: user.lastName, userLink: userLink});
            const info = await transporter.sendMail({
                from: '"DIER APP" <' + 'process.env.MAIL_USERNAME' + '>', // sender address
                to: user.email, // list of receivers
                subject: '[DIERS] Zaboravljenja lozinka', // Subject line
                text: 'Zaboravljenja lozinka, link: ' + userLink, // plain text body
                html: html, // html body
            });
            if (info.rejected.length > 0) {
                return false;
            }
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

exports.sendMailPasswordChanged = async (user, token) => {
    try {
        let transporter = this.generateTransporter();
        const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/reset-password?token=' :
            'http://localhost:4200/auth/reset-password?token=';
        const userLink = hostLink + token;
        fs.readFile('./mail_templates/password-changed.html', async (err, data) => {
            if (err) {
                throw err(err);
            }
            const template = handlebars.compile(data.toString());
            const html = template({firstName: user.firstName, lastName: user.lastName, userLink: userLink});
            const info = await transporter.sendMail({
                from: '"DIER APP" <' + 'process.env.MAIL_USERNAME' + '>', // sender address
                to: user.email, // list of receivers
                subject: '[DIERS] Lozinka promenjena', // Subject line
                text: 'Uspešno ste promenili lozinuku!', // plain text body
                html: html, // html body
            });
            if (info.rejected.length > 0) {
                return false;
            }
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
        const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/email-confirm' :
            'http://localhost:4200/auth/email-confirm';
        const errorLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/login' :
            'http://localhost:4200/auth/login';
        if (user) {
            user.verified = true;
            user.verificationToken = '';
            await userController.updateOneMethod({'_id': user._id}, user, {$unset: {verificationToken: ''}});
            res.redirect(hostLink);
        } else {
            res.redirect(errorLink);
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
            text: 'OD: ' + username + '\nBROJ TELEFONA:' + user.phone + '\nPORUKA: '
                + message + '\nEMAIL ZA KONTAKT: ' + email, // plain text body
        });
        res.status(200).json(true);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.permitRequest = async (req, res) => {
    if (!req.body.email || !req.body.requestType) {
        res.sendStatus(400);
        return;
    }
    let permitID, trashType, permitType;
    let permit = undefined;
    if (req.body.requestType === 'renewal') {
        if (!req.body.permitID) {
            res.sendStatus(400);
            return;
        }
        permitID = req.body.permitID;
        permit = await permitController.readOneMethod({'_id': permitID});
    } else if (req.body.requestType === 'creation') {
        if (!req.body.trashType || !req.body.permitType) {
            res.sendStatus(400);
            return;
        }
        permitType = req.body.permitType;
        trashType = req.body.trashType;
    }
    const email = req.body.email;
    const message = req.body.message;
    const requestType = req.body.requestType;
    const user = await userController.readOneMethod({'email': email});
    try {
        let transporter = this.generateTransporter();
        const info = await transporter.sendMail({
            from: '"DIER APP" <abelink10@gmail.com>', // sender address
            to: 'serbiansolutions@gmail.com', // list of receivers
            subject: '[ZAHTEV ZA DOZVOLU] ' + user.username, // Subject line
            text: 'OD: ' + user.username + '\nEMAIL ZA KONTAKT: ' + email + '\nTELEFON: ' + user.phone + '\nVRSTA ZAHTEVA: '
                + requestType + (permitID ? '\nKOD DOZVOLE: ' + permit.code : '') + (permitType ?
                    '\nVRSTA DOZVOLE: ' + permitType + '\nVRSTA OTPADA: ' + trashType : '') + '\nPORUKA: ' + message , // plain text body
        });
        res.status(200).json(true);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};
