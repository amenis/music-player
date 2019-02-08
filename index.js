'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port =  process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean',{useNewUrlParser: true},( err, res) => {
    if(err){
         throw err;
    } 
    else {
        console.log('success');
        app.listen(port, () => {
            console.log(`the server is runnning at http://localhost:${port}`);
        });
    }
});
