const userController = require('./user.controller');
const companyController = require('./company.controller');
const storageController = require('./storage.controller');
const permitController = require('./permit.controller');

exports.getOneUser = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await userController.readOneMethod(query);
        foundData.company = await companyController.readOneMethod({'_id': foundData.company});
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.getManyUsers = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value && req.params.value !== 'all') {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    query['role'] = 'manager';
    try {
        const foundData = await userController.readManyMethod(query);
        for (let u of foundData)
            u.company = await companyController.readOneMethod({'_id': u.company});
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
exports.getOneCompany = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await companyController.readOneMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.getManyCompanies = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value && req.params.value !== 'all') {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await companyController.readManyMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.getOneStorage = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await storageController.readOneMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
exports.getManyStorages = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value && req.params.value !== 'all') {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await storageController.readManyMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.error('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.getOnePermit = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await permitController.readOneMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
exports.getManyPermits = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value && req.params.value !== 'all') {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const foundData = await permitController.readManyMethod(query);
        res.status(200).json(foundData);
    } catch (err) {
        console.error('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.getCompanyNames = async (req, res) => {
    let query = {};
    let value = '';
    if (req.params.value && req.params.value !== 'all') {
        value = req.params.value;
    }
    try {
        let foundData = await companyController.readOnlyNamesMethod(query);
        if (value === 'storages') {
            foundData = foundData.filter(c => c.storages.length !== 0);
        } else if (value === 'permits') {
            foundData = foundData.filter(c => c.permits.length !== 0);
        }
        res.status(200).json(foundData);
    } catch (err) {
        console.error('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
