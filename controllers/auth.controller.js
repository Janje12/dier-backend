const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userController = require('./user.controller');
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
            foundUser = await userController.readOneMethod(user.email, 'email');
        else
            foundUser = await userController.readOneMethod(user.email, 'username');
        if (!foundUser) {
            res.sendStatus(403);
            return;
        }
        const company = await companyController.readOneMethod(foundUser.firma);
        if (!company) {
            res.sendStatus(403);
            return;
        }
        bcrypt.compare(user.password, foundUser.password, (err, result) => {
            if (err) {
                console.log('[METHOD-ERROR] ', err);
                res.sendStatus(500);
                return;
            }
            if (!result) {
                res.sendStatus(403);
                return;
            }
            const refreshToken = generateRefreshToken(foundUser, company);
            foundUser.token = refreshToken;
            const accessToken = generateAccessToken(foundUser, company);

            userController.updateOneMethod({'_id': foundUser._id}, foundUser);

            res.status(200).json({token: accessToken, user: foundUser});
        });
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.refresh = async (req, res) => {
    if (!req.body) {
        res.sendStatus(401);
        return;
    }
    let accessToken = req.body.token;
    const data = jwt.decode(accessToken).data;
    const refreshToken = data.korisnik.token;
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
        accessToken = generateAccessToken(user, company);

        res.status(200).json({token: accessToken, user: user});
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

function generateAccessToken(user, company) {
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
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign({
        data: {
            user: {
                username: user.username, firstName: user.firstName, lastName: user.lastName,
            },
        }
    }, process.env.REFERSH_TOKEN);
    return refreshToken;
}

exports.logout = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (token == null) {
        res.sendStatus(401);
        return;
    }
    try {
        const data = jwt.decode(token).data;
        const user = await userController.readOneMethod({'username': data.user.username});
        user.token = '';
        await userController.updateOneMethod({'_id': user._id}, user);
        res.status(200).json(user);
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).json({message: 'Korisnik ne postoji!'});
        return;
    }
    // Initalize the values to save
    let user = req.body;
    let company = req.body.firma;
    let vehicles = company.vehicles;
    let permits = company.permits;
    let storages = company.storages;

    company.address.place = await
        locationController.readOneMethod({'placeName': company.address.place.placeName});
    if (storages !== undefined) {
        for (let s of storages) {
            s.address.place = await locationController
                .readOneMethod({'placeName': s.address.place.placeName});
        }
    }

    // Populate the addresses for permits and its facilities and link the IDs
    if (permits !== undefined) {
        for (let p of permits) {
            if (p.address !== undefined) {
                p.address.place = await locationController
                    .readOneMethod({'placeName': p.address.place.placeName});
            }
        }
    }

    // Initialize the companies activity
    company.occupation = await occupationController.readOneMethod({'name': company.occupation.name});

    // Save the objects in the DB
    try {
        await userController.createMethod(user);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    try {
        await companyController.createMethod(company);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

    // Check which of the entities you CAN save in DB
    try {
        for (const s of storages)
            await storageController.createMethod(s);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    if (permits !== undefined) {
        try {
            for (const p of permits)
                await permitController.createMethod(p);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (vehicles !== undefined) {
        try {
            for (const v of vehicles)
                await vehicleController.createMethod(v);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    try {
        /*
            sLogin the user
            const refreshToken = generateRefreshToken(user, company);
            const accessToken = generateAccessToken(user, company);
            user.token = refreshToken;
            await korisnik_controller.updateMethod(user._id, user);
            res.status(200).json({token: accessToken, korisnik: user});
        */
        res.status(200).json();
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}
;
