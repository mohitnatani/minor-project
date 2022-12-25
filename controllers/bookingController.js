const BookingModel = require('../models/bookingmodel');
const PropertyModel = require('../models/PropertyModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const getBooking = async (req, res)=>{
    const token = req.cookies.jwt;
    let userPayload;
    if(token){
        userPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(userPayload);
    }
    try{
        const properties = await BookingModel.aggregate([
            {
                $match:{
                    whoBooked:mongoose.Types.ObjectId(userPayload._id)
                }
            },
            {
                $sort:{
                    from:-1
                }
            }
        ]);
        console.log(properties);
        
        for(let i=0; i<properties.length; i++){
            let temp = await PropertyModel.findOne({_id:properties[i].property}, {name:1, picture_url:1});
            properties[i].property = temp;
        }
        console.log(properties);
        //res.send({ status: 'success', output });
        res.render('booking', {properties});
        //res.render('property', {properties});
    }catch(err){
        console.log(err);
        res.status(500).send({ status: 'error', msg: 'Error fetching property' });
    }
}

const cancelBooking = async (req, res)=>{
    let {bookingID} = req.params;;
    try{
        const result = await BookingModel.findOne({_id:bookingID});
        if((new Date()).getTime() < result.from.getTime()){
            const deleteProperty = await BookingModel.findByIdAndDelete(bookingID);
            res.redirect('/booking');
        }else{
            res.redirect('/booking');
        }
        res.send('Cancel Booking');
    }catch(err){
        console.log(err);
    }
}

const confirmBooking = async (req, res)=>{
    const {property_id, from_date, to_date} = req.query;
    const token = req.cookies.jwt;
    let userPayload;
    if(token){
        userPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(userPayload);
        try{
            const resultProperty = await BookingModel.create({from:from_date, to:to_date, whoBooked:userPayload._id, property:property_id});
            console.log(resultProperty);
            res.send({error:0});
        }catch(err){
            console.log(err);
        }
    }else{
        res.send({error:1});
    }
}

module.exports ={
    getBooking,cancelBooking,confirmBooking
}