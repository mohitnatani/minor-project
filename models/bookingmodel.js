const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const BookingSchema = new Schema({
    from:Date,
    to:Date,
    whoBooked:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users'
    },
    property:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'property'
    }
});

const BookingModel = mongoose.model('booking', BookingSchema);
module.exports = BookingModel;