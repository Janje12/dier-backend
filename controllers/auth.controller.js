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
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    korisnik = req.body;
    console.log(req.body);
    try {
        // nadji Korisnika po emailu
        let korisnik1 = await korisnik_controller.findOneMethod(korisnik.email, 'email');
        // nadji Firmu
        let firma = await firma_controller.readOneMethod(korisnik1.firma);
        // Proveri da li je sifra tacna
        bcrypt.compare(korisnik.password, korisnik1.sifra).then((match) => {
            if (match) {
                // Genersisi tokene
                refreshToken = generateRefreshToken(korisnik1, firma);
                korisnik1.token = refreshToken;
                accessToken = generateAccessToken(korisnik1, firma);
                // Sacuvaj u DB
                korisnik_controller.updateMethod(korisnik1._id, korisnik1);
                res.status(200).json({
                    token: accessToken,
                    korisnik: korisnik1,
                });
            } else {
                res.sendStatus(403);
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
}

exports.refresh = async (req, res) => {
    if (!req.body) {
        res.sendStatus(401);
        return;
    }
    let accessToken = req.body.token;
    // pull out the data out of a object
    const data = jwt.decode(accessToken).data;
    let refreshToken = data.korisnik.token;
    try {
        const korisnik = await korisnik_controller.findOneMethod(refreshToken, 'token');
        if (korisnik == null) {
            res.sendStatus(403);
            return;
        }
        const firma = await firma_controller.readOneMethod(korisnik.firma);
        accessToken = generateAccessToken(korisnik, firma);
        res.status(200).json({token: accessToken, korisnik: korisnik});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

function generateAccessToken(korisnik, firma) {
    let expirePeriod = '20m';
    if (korisnik.rememberMe) {
        expirePeriod = '730h'
    }
    return jwt.sign({
        data: {
            korisnik: {
                korisnickoIme: korisnik.korisnickoIme,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                token: korisnik.token,
            },
            skladista: firma.skladista,
            firma: {
                radFirme: firma.radFirme,
                _id: firma._id
            },
        }
    }, process.env.ACCESS_TOKEN, {expiresIn: expirePeriod});
}

function generateRefreshToken(korisnik, firma) {
    return jwt.sign({
        data: {
            korisnik: {
                korisnickoIme: korisnik.korisnickoIme, ime: korisnik.ime, prezime: korisnik.prezime
            },
            firma: {
                radFirme: firma.radFirme,
                _id: firma._id
            },
        }
    }, process.env.REFERSH_TOKEN);
}

exports.logout = async (req, res) => {
    token = req.headers['authorization'].split(' ')[1];
    if (token == null) {
        res.sendStatus(401);
        return;
    }
    data = jwt.decode(token).data;
    korisnik = await korisnik_controller.findOneMethod(data.korisnik.korisnickoIme, 'korisnickoIme');
    korisnik.token = '';
    korisnik = await korisnik_controller.updateMethod(korisnik._id, korisnik);
    if (korisnik instanceof Error) {
        res.sendStatus(500);
    } else {
        res.status(200).json(korisnik);
    }
}

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).json({message: 'Korisnik ne postoji!'});
        return;
    }
    // Initalize the IDs
    let korisnik = req.body;
    korisnik._id = mongoose.Types.ObjectId();
    let firma = req.body.firma;
    firma._id = mongoose.Types.ObjectId();
    let prevozna_sredstva = firma.prevoznoSredstvo;
    if (prevozna_sredstva !== undefined) {
        prevozna_sredstva.forEach(x => x._id = mongoose.Types.ObjectId());
    }

    // Populate the missing values
    firma.adresa.mesto = await mesto_controller.findOneMethod(firma.adresa.mesto.mestoNaziv, 'mestoNaziv');
    firma.delatnost = await delatnost_controller.findOneMethod(firma.delatnost.naziv, 'naziv');
    let skladista = firma.skladista;
    if (skladista !== undefined) {
        skladista.forEach(x => x._id = mongoose.Types.ObjectId());
        for (let i = 0; i < skladista.length; i++) {
            skladista[i].adresa.mesto = await mesto_controller
                .findOneMethod(skladista[i].adresa.mesto.mestoNaziv, 'mestoNaziv')
        }
    }
    let dozvole = firma.dozvola;
    let skladistaTretman = [];
    let skladistaDeponija = [];
    let skladistaSkladistenje = [];
    if (dozvole !== undefined) {
        dozvole.forEach(x => {
            x._id = mongoose.Types.ObjectId()
            if(x.skladistaTretman !== undefined)
                x.adresa = x.skladistaTretman.adresa;
            if(x.skladistaDeponija !== undefined)
                x.adresa = x.skladistaDeponija.adresa;
            if(x.skladistaSkladistenje !== undefined)
                x.adresa = x.skladistaSkladistenje.adresa;
        });
        for (let i = 0; i < dozvole.length; i++) {
            dozvole[i].adresa.mesto = await mesto_controller
                .findOneMethod(dozvole[i].adresa.mesto.mestoNaziv, 'mestoNaziv');
            /* dodaj Skladiste po dozvoli ako postoje */
            if (dozvole[i].skladistaTretman !== undefined) {
                const st = dozvole[i].skladistaTretman;
                st.adresa = dozvole[i].adresa;
                st._id = mongoose.Types.ObjectId();
                dozvole[i].skladistaTretman = st;
                skladistaTretman.push(st);
            } else if (dozvole[i].skladistaDeponija !== undefined) {
                const sd = dozvole[i].skladistaDeponija;
                sd.adresa = dozvole[i].adresa;
                sd._id = mongoose.Types.ObjectId();
                dozvole[i].skladistaDeponija = sd;
                skladistaDeponija.push(sd);
            } else if (dozvole[i].skladistaSkladistenje !== undefined) {
                const ss = dozvole[i].skladistaSkladistenje;
                ss.adresa = dozvole[i].adresa;
                ss._id = mongoose.Types.ObjectId();
                dozvole[i].skladistaSkladistenje = ss;
                skladistaSkladistenje.push(ss);
            }
        }
        firma.skladistaTretman = skladistaTretman;
        firma.skladistaDeponija = skladistaDeponija;
        firma.skladistaSkladistenje = skladistaSkladistenje;
    }

    // Save the objects in the DB
    try {
        korisnik = await korisnik_controller.createMethod(korisnik);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    try {
        firma = await firma_controller.createMethod(firma);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

    // Check which of the entities you CAN save in DB
    if (skladista !== undefined) {
        try {
            for (let i = 0; i < skladista.length; i++) {
                skladista[i] = await skladiste_controller.createMethod(skladista[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (skladistaTretman !== undefined) {
        try {
            for (let i = 0; i < skladistaTretman.length; i++) {
                skladistaTretman[i] = await skladisteTretman_controller.createMethod(skladistaTretman[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (skladistaDeponija !== undefined) {
        try {
            for (let i = 0; i < skladistaDeponija.length; i++) {
                skladistaDeponija[i] = await skladisteDeponija_controller.createMethod(skladistaDeponija[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (skladistaSkladistenje !== undefined) {
        try {
            for (let i = 0; i < skladistaSkladistenje.length; i++) {
                skladistaSkladistenje[i] = await skladiste_controller.createMethod(skladistaSkladistenje[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (dozvole !== undefined) {
        try {
            for (let i = 0; i < dozvole.length; i++) {
                dozvole[i] = await dozvola_controller.createMethod(dozvole[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    if (prevozna_sredstva !== undefined) {
        try {
            for (let i = 0; i < prevozna_sredstva.length; i++) {
                prevozna_sredstva[i] = await prevoznoSredstvo_controller.createMethod(prevozna_sredstva[i]);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    // Login the user
    try {
        const refreshToken = generateRefreshToken(korisnik, firma);
        korisnik.token = refreshToken;
        const accessToken = generateAccessToken(korisnik, firma);
        await korisnik_controller.updateMethod(korisnik._id, korisnik);
        res.status(200).json({token: accessToken, korisnik: korisnik});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}
