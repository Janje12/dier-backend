require('dotenv').config();
const mailer = require('nodemailer');
const userController = require('./user.controller');

exports.sendMailVerification = async (user) => {
    try {
        let transporter = mailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
        const hostLink = process.env.NODE_ENV ? 'https://janje12.github.io/dier_frontend/auth/email-confirm' :
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

exports.verify = async (req, res) => {
    if (!req.params.verificationToken)
        res.sendStatus(401);
    const verificationToken = req.params.verificationToken;
    try {
        const user = await userController.readOneMethod({'verificationToken': verificationToken});
        if (user !== null) {
            user.verified = true;
            user.verificationToken = undefined;
            await userController.updateOneMethod({'_id': user._id}, user, {$unset: {verificationToken: ''}});
            res.redirect('http://localhost:4200/auth/email-confirm');
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};
