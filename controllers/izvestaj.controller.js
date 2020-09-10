const Izvestaj = require('../models/mesecniIzvestaj');
const {PdfReader} = require('pdfreader');
const fs = require('fs');

exports.create = async (req, res) => {
    try {
        const reader = new PdfReader();
        fs.readFile("DEO.pdf", (err, pdfBuffer) => {
            // pdfBuffer contains the file content
            reader.parseBuffer(pdfBuffer, function(err, item) {
                if (err) console.log(err);
                else if (!item) return;
                else if (item.text) console.log(item.text);
            });
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
