const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dkoSchema = mongoose.Schema({
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: true},
        vrstaOtpada: {type: String, required: true},
        qLista: {type: String, required: true},
        masaOtpada: {type: Number, required: true},
        nacinPakovanja: {type: String, required: true},
        fizickoStanje: {type: String, required: true},
        sifraIspitivanja: {type: String, required: true},
        datumIspitivanja: {type: Date, required: true},
        vidPrevoza: {type: String, required: true},
        dodatneInformacije: {type: String, required: false},
        nacinPostupanja: {type: String, required: true},
        vrstaProizvodjaca: {type: String, required: true},
        rutaKretanja: [{type: String, required: true}],
        vrstaVozila: {type: String, required: true},
        registarskiBroj: {type: String, required: true},
        firmaProizvodjac: {type: Schema.Types.ObjectId, ref: 'FirmaKomitent', required: true},
        firmaTransport: {type: Schema.Types.ObjectId, ref: 'FirmaKomitent', required: true},
        firmaPrimalac: {type: Schema.Types.ObjectId, ref: 'FirmaKomitent', required: true},
        vrstaPrimalaca:  {type: String, required: true},
        sifraDozvoleProizvodjac: {type: String, required: false},
        datumDozvoleProizvodjac: {type: Date, required: false},
        sifraDozvoleTransport: {type: String, required: true},
        datumDozvoleTransport: {type: Date, required: true},
        sifraDozvolePrimalac: {type: String, required: true},
        datumDozvolePrimalac: {type: Date, required: true},
    }
);

module.exports = mongoose.model('DKO', dkoSchema);

