const mongoose = require('mongoose');
const url = `mongodb+srv://iamjackchen:Pass_word129@dev.tbmot.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
