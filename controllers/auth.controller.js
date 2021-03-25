const bcrypt = require('bcrypt');
const tokenController = require('./token.controller');
const userController = require('./user.controller');
const mailController = require('./mail.controller');
const companyController = require('./company.controller');
const storageController = require('./storage.controller');
const locationController = require('./location.controller');
const occupationController = require('./occupation.controller');
const permitController = require('./permit.controller');
const vehicleController = require('./vehicle.controller');

exports.login = async (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.sendStatus(400);
        return;
    }
    const user = req.body;

    try {
        let foundUser;
        // Disallow @ in the usernames!
        if (user.email.includes('@'))
            foundUser = await userController.readOneMethod({email: user.email}, '+password');
        else
            foundUser = await userController.readOneMethod({username: user.email}, '+password');
        if (!foundUser) {
            res.sendStatus(403);
            return;
        }
        const company = await companyController.readOneMethod(foundUser.company);
        if (!company) {
            res.sendStatus(403);
            return;
        }
        /*if (!foundUser.verified) {
             res.sendStatus(403);
             return;
         }*/
        bcrypt.compare(user.password, foundUser.password, async (err, result) => {
            if (err) {
                console.log('[METHOD-ERROR] ', err);
                res.sendStatus(500);
                return;
            }
            if (!result) {
                res.sendStatus(403);
                return;
            }
            const refreshToken = await tokenController.generateRefreshToken(foundUser, company);
            foundUser.token = refreshToken;
            const accessToken = await tokenController.generateAccessToken(foundUser, company);

            foundUser = await userController.updateOneMethod({'_id': foundUser._id}, foundUser);
            res.status(200).json({token: accessToken, user: foundUser});
        });
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.refresh = async (req, res) => {
    if (!req.body.token) {
        res.sendStatus(401);
        return;
    }
    let accessToken = req.body.token;
    const {data, exp} = await tokenController.extractUserInfo(undefined, accessToken);
    const refreshToken = data.user.token;
    try {
        const user = await userController.readOneMethod({'token': refreshToken});
        if (!user) {
            res.sendStatus(403);
            return;
        }
        const company = await companyController.readOneMethod({'_id': user.company});
        if (!company) {
            res.sendStatus(403);
            return;
        }
        accessToken = await tokenController.generateAccessToken(user, company);

        res.status(200).json({token: accessToken, user: user});
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.logout = async (req, res) => {
    const {data, exp} = await tokenController.extractUserInfo(req.headers);
    if (data === null || Date.now() >= exp * 1000) {
        res.sendStatus(401);
        return;
    }
    try {
        const user = await userController.readOneMethod({'_id': data.user._id});
        user.token = '';
        await userController.updateOneMethod({'_id': user._id}, user);
        res.status(200).json(user);
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.forgotPassword = async (req, res) => {
    if (!req.body.email) {
        res.sendStatus(401);
        return;
    }
    const email = req.body.email;
    try {
        const user = await userController.readOneMethod({'email': email}, '+password');
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const token = await tokenController.generatePasswordResetToken(email);
        const test = await mailController.sendMailResetPassword(user, token);
        if (!test) {
            res.sendStatus(500);
            return;
        } else {
            res.status(200).json({'message': 'success'});
        }
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.resetPassword = async (req, res) => {
    if (!req.body.password) {
        res.sendStatus(401);
        return;
    }
    const password = req.body.password;
    // FIX THIS FUCKIN ELL
    const token = req.headers['referer'].split('token=')[1];
    try {
        const data = await tokenController.extractUserInfo(undefined, token);
        const email = data.data.email;
        console.log(data);
        if (Date.now() >= data.exp * 1000) {
            res.sendStatus(403);
            return;
        }
        const user = await userController.readOneMethod({'email': email});
        if (!user) {
            res.sendStatus(403);
            return;
        }
        user.passResetToken = '';
        user.password = await tokenController.hashPassword(password);
        await userController.updateOneMethod({'_id': user._id}, user, {$unset: {'passResetToken': ''}});
        res.status(201).json({'message': 'OK'});
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.changePassword = async (req, res) => {
    if (!req.body.newPassword || !req.body.oldPassword || !req.body._id) {
        res.status(401).json(false);
        return;
    }
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const _id = req.body._id;
    try {
        let foundUser = await userController.readOneMethod({'_id': _id}, '+password');
        if (!foundUser) {
            res.status(400).json(false);
            return;
        }
        bcrypt.compare(oldPassword, foundUser.password, async (err, result) => {
            if (err) {
                console.log('[METHOD-ERROR] ', err);
                res.status(500).json({error: result});
                return;
            }
            if (!result) {
                res.status(400).json({error: result});
                return;
            }
            foundUser.password = await tokenController.hashPassword(newPassword);
            foundUser = await userController.updateOneMethod({'_id': foundUser._id}, foundUser);
            const token = await tokenController.generatePasswordResetToken(foundUser.email);
            await mailController.sendMailPasswordChanged(foundUser, token);
            res.status(201).json(true);
        });
    } catch (e) {
        console.log('[REQUEST-ERROR] ', e);
        res.status(500).json(false);
    }
};

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).json({message: 'Korisnik ne postoji!'});
        return;
    }
    // Initalize the values to save
    // TRANSACTIONS AND SESSIONS
    let user = req.body;
    let company = req.body.company;
    let vehicles = company.vehicles;
    let permits = company.permits;
    let storages = company.storages;

    // Populate the locations for company and storages
    company.address.location = await
        locationController.readOneMethod({'placeName': company.address.location.placeName});
    if (storages !== undefined) {
        for (let s of storages) {
            s.address.location = await locationController
                .readOneMethod({'placeName': s.address.location.placeName});
        }
    }

    // Populate the addresses for permits and its facilities and link the IDs
    if (permits !== undefined) {
        for (let p of permits) {
            if (p.address !== undefined) {
                p.address.location = await locationController
                    .readOneMethod({'placeName': p.address.location.placeName});
            }
        }
    }

    // Initialize the companies ocupation
    company.occupation = await occupationController.readOneMethod({'name': company.occupation.name});
    // Save the objects in the DB
    try {
        for (let i = 0; i < storages.length; i++)
            storages[i] = await storageController.createMethod(storages[i]);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
    if (permits !== undefined) {
        try {
            for (let i = 0; i < permits.length; i++) {
                if (permits[i].storage !== undefined)
                    storages.forEach(x => {
                        if (x.name === permits[i].storage.name)
                            permits[i].storage = x;
                    });
                permits[i] = await permitController.createMethod(permits[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
    }
    if (vehicles !== undefined) {
        try {
            console.log(vehicles);
            for (let i = 0; i < vehicles.length; i++)
                vehicles[i] = await vehicleController.createMethod(vehicles[i]);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
    }
    company.storages = storages;
    company.permits = permits;
    company.vehicles = vehicles;
    try {
        company = await companyController.createMethod(company);
    } catch (err) {
        //console.log(err);
        res.sendStatus(500);
        return;
    }
    user.company = company;
    try {
        user.verificationToken = tokenController.generateVerificationToken(user.username);
        user = await userController.createMethod(user);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
    try {
        const mailSent = await mailController.sendMailVerification(user);
        if (!mailSent)
            throw new Error();
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
    // Check which of the entities you CAN save in DB
    try {
        // Login the user
        const refreshToken = await tokenController.generateRefreshToken(user, company);
        const accessToken = await tokenController.generateAccessToken(user, company);
        user.token = refreshToken;
        await userController.updateOneMethod({'_id': user._id}, user);
        res.status(200).json({token: accessToken, user: user});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};
