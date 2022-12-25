const PropertyModel = require('../models/PropertyModel');
const {cloudinary, upload} = require('../cloudinaryConfig');
const {Base64} = require('js-base64');
const jwt = require('jsonwebtoken');

const getListing = async (req, res) => {
    const token = req.cookies.jwt;
    let userPayload;
    if(token){
        userPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(userPayload);
    }
    try{
        const properties = await PropertyModel.find({owner:userPayload._id});
        //res.send({ status: 'success', properties });
        console.log(properties);
        res.render('property', {properties});
    }catch(err){
        console.log(err);
        res.status(500).send({ status: 'error', msg: 'Error fetching property' });
    }
}

const getListingByID = async (req, res) => {
    const {propertyID} = req.params;
    try{
        const property = await PropertyModel.findById(propertyID);
        if (!property) {
            res.status(404).send({ status: 'error', msg: 'Property not found' })
        } else {
            //res.send({ status: 'success', property: property })
            res.render('updateproperty', {property});
        }
    }catch(err){
        console.log(err)
        res.status(500).send({ status: 'error', msg: 'Error fetching property by ID' });
    }
}

const createListing = async (req, res) => {
    if(req.method === "GET"){
        res.render('createproperty');
    }else{
        let propertyData = req.body;
        console.log(propertyData);
        //res.send('Post Student');
        if(req.file){
            console.log('File present');
            let fileData = req.file;
            const base64String = Base64.encode(fileData.buffer);
            const data = await cloudinary.uploader.upload(`data:${fileData.mimetype};base64,${base64String}`);
            console.log(data.secure_url);
            propertyData.picture_url = data.secure_url;
            console.log(propertyData);
        }
        if("amenities" in propertyData){
            if(!(propertyData.amenities instanceof Array)){
                let temp = [];
                temp.push(propertyData.parents);
                propertyData.amenities = temp;
                console.log(propertyData);
            }
        }
        const token = req.cookies.jwt
        if(token){
            const userPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            propertyData.owner = userPayload._id;
        }
        try{
            const resultProperty = await PropertyModel.create(propertyData);
            console.log(resultProperty);
            //res.status(201).send({ status: 'success', property: resultProperty });
            res.redirect('/propertylisting');
        }catch(err){
            console.log(err);
            res.status(500).send({ status: 'error', msg: err.errors });
        }
    }
}

const updateListingByID = async (req, res) => {
    const {propertyID} = req.params;
    const updatePropertyData = req.body;
    console.log(updatePropertyData);

    if(req.file){
        console.log('File present');
        let fileData = req.file;
        const base64String = Base64.encode(fileData.buffer);
        const data = await cloudinary.uploader.upload(`data:${fileData.mimetype};base64,${base64String}`);
        console.log(data.secure_url);
        updatePropertyData.picture_url = data.secure_url;
        console.log(updatePropertyData);
    }
    if("amenities" in updatePropertyData){
        if(!(updatePropertyData.amenities instanceof Array)){
            let temp = [];
            temp.push(updatePropertyData.amenities);
            updatePropertyData.amenities = temp;
            console.log(updatePropertyData);
        }
    }
    
    try{
        const updateProperty = await PropertyModel.findByIdAndUpdate(propertyID, updatePropertyData, { new: true, runValidators: true })
        //res.send({ status: 'Updated Successfully', student: updateProperty })
        res.redirect('/propertylisting');
    }catch(err){
        console.log(err);
        res.status(500).send({ status: 'error', msg: 'Cannot Update Listing' });
    }
}

const deleteListingByID = async (req, res) => {
    const {propertyID} = req.params;
    try{
        const deleteProperty = await PropertyModel.findByIdAndDelete(propertyID);
        //res.send({ status: 'Deleted Successfully', property: deleteProperty });
        res.redirect('/propertylisting')
    }catch(err){
        console.log(err);
        res.status(500).send({ status: 'Cannot delete listing due to internal error' })
    }
}

module.exports ={
    getListing, getListingByID, createListing, updateListingByID, deleteListingByID
}