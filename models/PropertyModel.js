const mongoose = require('mongoose');
const {Schema} = require('mongoose');

let PropertySchema = new Schema({
    name:String,
    description:String,
    picture_url:String,
    property_type:String,
    bedrooms:{
        type:Number
    },
    bathrooms:{
        type:Number
    },
    price:{
        type:Number
    },
    amenities:[{
        type:String
    }],
    address:{
        street:String,
        city:String,
        state:String
    },
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users'
    }
})

const PropertyModel = mongoose.model('property', PropertySchema);
module.exports = PropertyModel;