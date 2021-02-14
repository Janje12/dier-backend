exports.routesInit = (app) => {
    const indexRouter = require('./routes/index');
    const authRouter = require('./routes/auth.router');
    const userRouter = require('./routes/user.router');
    const companyRouter = require('./routes/company.router');
    const vehicleRouter = require('./routes/vehicle.router');
    const locationRouter = require('./routes/location.router');
    const transactionRouter = require('./routes/transaction.router');
    const permitRouter = require('./routes/permit.router');
    const trashRouter = require('./routes/trash.router');
    const catalogRouter = require('./routes/catalog.router');
    const occupationRouter = require('./routes/occupation.router');
    const storageRouter = require('./routes/storage.router');/*
    const wmdRouter = require('./routes/wmd.router');
    const monthlyReportRouter = require('./routes/monthlyReport.router');
    const yearlyReportRouter = require('./routes/yearlyReport.router');*/

    app.use('/', indexRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/company', companyRouter);
    app.use('/api/occupation', occupationRouter);
    app.use('/api/location', locationRouter);
    app.use('/api/permit', permitRouter);
    app.use('/api/vehicle', vehicleRouter);
    app.use('/api/storage', storageRouter);
    app.use('/api/catalog', catalogRouter);
    app.use('/api/trash', trashRouter);
    app.use('/api/transaction', transactionRouter);/*
    app.use('/api/wmd', wmdRouter);
    app.use('/api/monthlyreport', monthlyReportRouter);
    app.use('/api/yearlyreport', yearlyReportRouter);*/

    console.log('[SERVER] Routes initialized');
};
