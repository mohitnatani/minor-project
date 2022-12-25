const PropertyModel = require('../models/PropertyModel');

const main = async (req, res) =>{
    const {cityname} = req.params;
    try{
        //const listingsAndReviewsCollection = client.db(dbName).collection(collection);
        let {propertytype=["Apartment"],bedrooms=1, bathrooms=1, ajax=0} = req.query;
        
        if(!(propertytype instanceof Array)){
            propertytype = [propertytype];
        }
        
        const result = await PropertyModel.find({'property_type':{$in:propertytype}, 'bedrooms':{$gte:Number(bedrooms)}, 'bathrooms':{$gte:Number(bathrooms)}, 'address.city':cityname});
        console.log(result);
        console.log(`Ajax=${ajax}`);
        if(Number(ajax) === 1){
            console.log('Inside if');
            //console.dir(query);
            //console.log(output);
            res.json(result);
        }else{
            console.log('Inside else');
            //res.render('places', {output});
            res.render('citywiseproperty', {result});
        }
    }catch(err){
        console.log(`Error fetching documents: ${err}`);
    }
}

const listing = async (req, res)=>{
    const {listingId} = req.params;
    try{
        const output = await PropertyModel.findById(listingId);
        if (!output) {
            res.status(404).send({ status: 'error', msg: 'Property not found' })
        } else {
            //res.send({ status: 'success', property: property })
            console.log(output);
            res.render('propertylisting', {output});
        }
    }catch(err){
        console.log(err)
        res.status(500).send({ status: 'error', msg: 'Error fetching property by ID' });
    }
}

module.exports = {
    main, listing
}
