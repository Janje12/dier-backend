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
    if (!req.body.token) {
        res.sendStatus(401);
        return;
    }
    let accessToken = req.body.token;
    const data = jwt.decode(accessToken).data;
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
        const user = await userController.readOneMethod({'_id': data.user._id});
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
    // TRANSACTIONS AND SESSIONS
    let user = req.body;
    delete user._id; // obrisi
    let company = req.body.company;
    let vehicles = company.vehicles;
    let permits = company.permits;
    let storages = company.storages;

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

    // Initialize the companies activity
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
        user = await userController.createMethod(user);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
    // Check which of the entities you CAN save in DB
    try {
        // Login the user
        const refreshToken = generateRefreshToken(user, company);
        const accessToken = generateAccessToken(user, company);
        user.token = refreshToken;
        await userController.updateOneMethod({'_id': user._id}, user);
        // vracas password
        res.status(200).json({token: accessToken, user: user});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};
