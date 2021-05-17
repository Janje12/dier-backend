const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const crypto = require('crypto');
const iv = Buffer.from(process.env.NRIZ_IV_TOKEN, 'binary');
const salt = process.env.NRIZ_PASSWORD_SALT;
const hash = crypto.createHash('sha1');
hash.update(salt);
const key = Buffer.from(hash.digest('binary').substring(0, 16), 'binary');

exports.encrypt = async (text) => {
    try {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    } catch (e) {
        console.log('[ENCRYPTION-ERROR] ', e);
        throw new Error(e);
    }
};

exports.decrypt = async (text) => {
    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (e) {
        console.log('[DECRYPTION-ERROR] ', e);
        throw new Error(e);
    }
};

exports.extractUserInfo = async (headers, token = undefined) => {
    try {
        if (token === undefined)
            token = headers['authorization'].split(' ')[1];
        return jwt.decode(token);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.generateAccessToken = async (user, company) => {
    let expirePeriod = '30m';
    if (user.rememberMe)
        expirePeriod = '730h';
    const accessToken = jwt.sign({
        data: {
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: user.token,
            },
            company: {
                _id: company._id,
                operations: company.operations,
            },
        }
    }, process.env.ACCESS_TOKEN, {expiresIn: expirePeriod});
    return accessToken;
};

exports.generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({
        data: {
            user: {
                username: user.username, firstName: user.firstName, lastName: user.lastName,
            },
        }
    }, process.env.REFERSH_TOKEN);
    return refreshToken;
};

exports.generatePasswordResetToken = (email) => {
    const passwordResetToken = jwt.sign({
        data: {
           email: email,
        }
    }, process.env.REFERSH_TOKEN, {expiresIn: '10s'});
    return passwordResetToken;
};

exports.generateVerificationToken = (username) => {
    const token = crypto.createHash('sha256')
        .update(username)
        .digest('hex');
    return token;
};

exports.hashPassword = async (password) => {
    try {
        password = await bcrypt.hash(password, 10);
        return password;
    } catch(e) {
        console.log(e);
        throw new Error(e);
    }
};
