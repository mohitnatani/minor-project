const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const UserSchema = new Schema({
    name:String,
    email:String,
    password:String,
    isOwner:String
});

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel;