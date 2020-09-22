const korisnik_controller = require('../controllers/korisnik.controller');
const firma_controller = require('../controllers/firma.controller');
const skladiste_controller = require('../controllers/skladiste.controller');
const skladisteTretman_controller = require('../controllers/skladiste-tretman.controller');
const skladisteDeponija_controller = require('../controllers/skladiste-deponija.controller');
const mesto_controller = require('../controllers/mesto.controller');
const delatnost_controller = require('../controllers/delatnost.controller');
const dozvola_controller = require('../controllers/dozvole_controller');
const prevoznoSredstvo_controller = require('../controllers/prevozno-sredstvo.controller');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.sendStatus(400);
        return;
    }
    const user = req.body;
    try {
        const foundUser = await korisnik_controller.findOneMethod(user.email, 'email');
        if (!foundUser) {
            res.sendStatus(403);
            return;
        }
        const company = await firma_controller.readOneMethod(foundUser.firma);
        if (!company) {
            res.sendStatus(403);
            return;
        }
        bcrypt.compare(user.password, foundUser.sifra, (err, rez) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            if (!rez) {
                res.sendStatus(403);
                return;
            }
            const refreshToken = generateRefreshToken(foundUser, company);
            const accessToken = generateAccessToken(foundUser, company);

            foundUser.token = refreshToken;
            korisnik_controller.updateMethod(foundUser._id, foundUser);

            res.status(200).json({token: accessToken, korisnik: foundUser});
        });
    } catch (err) {
        console.log(err);
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
        const user = await korisnik_controller.findOneMethod(refreshToken, 'token');
        if (!user) {
            res.sendStatus(403);
            return;
        }
        const company = await firma_controller.readOneMethod(user.firma);
        if (!company) {
            res.sendStatus(403);
            return;
        }
        accessToken = generateAccessToken(user, company);

        res.status(200).json({token: accessToken, korisnik: user});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

function generateAccessToken(user, company) {
    let expirePeriod = '20m';
    if (user.rememberMe)
        expirePeriod = '730h';
    const accessToken = jwt.sign({
        data: {
            korisnik: {
                _id: user._id,
                korisnickoIme: user.korisnickoIme,
                ime: user.ime,
                prezime: user.prezime,
                uloga: user.uloga,
                token: user.token,
            },
            firma: {
                _id: company._id,
                radFirme: company.radFirme,
            },
        }
    }, process.env.ACCESS_TOKEN, {expiresIn: expirePeriod});
    return accessToken;
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign({
        data: {
            korisnik: {
                korisnickoIme: user.korisnickoIme, ime: user.ime, prezime: user.prezime,
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
        const user = await korisnik_controller.findOneMethod(data.korisnik.korisnickoIme, 'korisnickoIme');
        user.token = '';
        await korisnik_controller.updateMethod(user._id, user);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
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
    let transport = company.prevoznoSredstvo;
    let permit = company.dozvola;
    let storage = company.skladista;
    let storageTreatment = company.skladistaTretman;
    let storageDump = company.skladistaDeponija;
    let storageCache = company.skladisteSkladistenje;

    // init the IDs
    user._id = mongoose.Types.ObjectId();
    company._id = mongoose.Types.ObjectId();
    if (transport !== undefined)
        transport.forEach(t => t._id = mongoose.Types.ObjectId());
    if (permit !== undefined)
        permit.forEach(p => p._id = mongoose.Types.ObjectId());
    if (storage !== undefined)
        storage.forEach(s => s._id = mongoose.Types.ObjectId());
    if (storageTreatment !== undefined)
        storageTreatment.forEach(st => st._id = mongoose.Types.ObjectId());
    if (storageDump !== undefined)
        storageDump.forEach(sd => sd._id = mongoose.Types.ObjectId());
    if (storageCache !== undefined)
        storageCache.forEach(sc => sc._id = mongoose.Types.ObjectId());

    // Populate the addresses
    company.adresa.mesto = await mesto_controller.findOneMethod(company.adresa.mesto.mestoNaziv, 'mestoNaziv');
    if (storage !== undefined) {
        for (let s of storage) {
            s.adresa.mesto = await mesto_controller
                .findOneMethod(s.adresa.mesto.mestoNaziv, 'mestoNaziv');
        }
    }

    if (storageTreatment !== undefined) {
        for (let st of storageTreatment)
            st.adresa.mesto = await mesto_controller
                .findOneMethod(st.adresa.mesto.mestoNaziv, 'mestoNaziv');
    }
    if (storageDump !== undefined) {
        for (let sd of storageDump)
            sd.adresa.mesto = await mesto_controller
                .findOneMethod(sd.adresa.mesto.mestoNaziv, 'mestoNaziv');
    }
    if (storageCache !== undefined) {
        for (let sc of storageCache)
            sc.adresa.mesto = await mesto_controller
                .findOneMethod(sc.adresa.mesto.mestoNaziv, 'mestoNaziv');
    }

    // Populate the addresses for permits and its facilities and link the IDs
    if (permit !== undefined) {
        let countST = 0;
        let countSD = 0;
        let countSC = 0;
        for (let p of permit) {
            if (p.adresa !== undefined) {
                p.adresa.mesto = await mesto_controller
                    .findOneMethod(p.adresa.mesto.mestoNaziv, 'mestoNaziv');
                /* HAS TO BE TESTED THOROUGHLY!! AND MOVE THE STORAGE ADDRESS LOOKUP HERE */
                if (p.skladistaTretman !== undefined) {
                    p.skladistaTretman._id = storageTreatment[countST]._id;
                    countST++;
                }
                if (p.skladistaDeponija !== undefined) {
                    p.skladistaDeponija._id = storageDump[countSD]._id;
                    countSD++;
                }
                if (p.skladistaSkladistenje !== undefined) {
                    p.skladistaSkladistenje._id = storageCache[countSC]._id;
                    countSC++;
                }
            }
        }
    }

    // Initialize the companies activity
    company.delatnost = await delatnost_controller.findOneMethod(company.delatnost.naziv, 'naziv');

    // Save the objects in the DB
    try {
        user = await korisnik_controller.createMethod(user);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    try {
        company = await firma_controller.createMethod(company);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

    // Check which of the entities you CAN save in DB
    if (storage !== undefined) {
        try {
            for (const s of storage)
                await skladiste_controller.createMethod(s);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (storageTreatment !== undefined) {
        try {
            for (const st of storageTreatment)
                await skladisteTretman_controller.createMethod(st);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (storageDump !== undefined) {
        try {
            for (const sd of storageDump)
                await skladisteDeponija_controller.createMethod(sd);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (storageCache !== undefined) {
        try {
            for (const sc of storageCache)
                await skladiste_controller.createMethod(sc);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (permit !== undefined) {
        try {
            for (const p of permit)
                await dozvola_controller.createMethod(p);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (transport !== undefined) {
        try {
            for (const t of transport)
                await prevoznoSredstvo_controller.createMethod(t);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    // Login the user
    try {
        const refreshToken = generateRefreshToken(user, company);
        const accessToken = generateAccessToken(user, company);
        user.token = refreshToken;
        await korisnik_controller.updateMethod(user._id, user);
        res.status(200).json({token: accessToken, korisnik: user});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};
