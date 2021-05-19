const mongoose = require('mongoose');

exports.databaseInit = () => {
    const env = process.env.NODE_ENV || 'development';
    console.log('Environment', env);
   let dbURI = process.env.DB;
    if (env === 'development')
        dbURI = 'mongodb://localhost:27017/dierTest';
    try {
        mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('[DB] Connected with database!')
        });
    } catch (err) {
        console.log('[DB] Problem with connecting with database!');
        console.log(err);
    }
};
