const mongoose = require('mongoose');

async function initDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL, {dbName:"rental"});
        console.log('Connected to DB successfully!');
    }catch(err){
        console.log('Error connecting to DB');
        process.exit();
    }
}

module.exports = {
    initDB
}