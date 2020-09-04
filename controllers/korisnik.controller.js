require('dotenv').config();
const Korisnik = require('../models/korisnik');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body;
    try {
        const data = await this.createMethod(newData);
        res.status(201).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

/*
    When creating a new user the password needs to be hashed for safer storage.
 */
exports.createMethod = async (data) => {
    try {
        const hashedSifra = await bcrypt.hash(data.sifra, 10);
        data.sifra = hashedSifra;
        const savedData = await Korisnik.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readMany = async (req, res) => {
    let query = {};
    if (req.body.query)
        query = req.body.query;
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readManyMethod = async (query) => {
    try {
        const foundData = await Korisnik.find(query).populate('firma');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readOne = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const _id = req.params.id;
    try {
        const data = await this.readOneMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readOneMethod = async (_id) => {
    try {
        const foundData = await Korisnik.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.findOne = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    try {
        const data = await this.findOneMethod(value, type);
        console.log(data);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.findOneMethod = async (value, type) => {
    let query = {};
    query[type] = value;
    console.log(query);
    try {
        const foundData = await Korisnik.findOne(query).populate('firma');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.update = async (req, res) => {
    if (!req.params && !req.body) {
        res.sendStatus(400);
        return;
    }
    const _id = req.params.id;
    const updatingData = req.body;
    try {
        const data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Korisnik.findByIdAndUpdate(_id, updatingData);
        return updatedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.delete = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    _id = req.params.id;
    try {
        data = await this.deleteMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await Korisnik.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getProfileKorisnik = async (req, res) => {
    if (!req.params) {
        res.sendStatus(404);
        return;
    }
    const korisnickoIme = req.params.id;
    try {
        const korisnik = await this.findOneMethod(korisnickoIme, 'korisnickoIme');
        res.status(200).json({
            _id: korisnik._id,
            korisnickoIme: korisnik.korisnickoIme,
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            email: korisnik.email,
            telefon: korisnik.telefon,
            uloga: korisnik.uloga,
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
