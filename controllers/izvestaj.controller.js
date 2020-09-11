const Izvestaj = require('../models/mesecniIzvestaj');
const pdf = require("pdf-creator-node");
const fs = require('fs');

exports.create = async (req, res) => {
    try {
        const html = fs.readFileSync('DEO1.html', 'utf8');
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
        };
        const akcije = [
            {
            datum: '25.4.2019',
            proizvedenaKolicina: 78,
            predataKolicina: '/',
            stanje: 672,
        },
            {
                datum: '26.4.2019',
                proizvedenaKolicina: 28,
                predataKolicina: '/',
                stanje: 700,
            }];
        const ukupno = 500;
        let count = [];
        for (let i = 0; i < 28; i++)
            count.push(i);
        const document = {
            html: html,
            data: {
                akcije: akcije,
                count: count,
                ukupno: ukupno,
            },
            path: "./output.pdf"
        };
        pdf.create(document, options)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.createMethod = async (data) => {
    try {
        const savedData = await Izvestaj.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
