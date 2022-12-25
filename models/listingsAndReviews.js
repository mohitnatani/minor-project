const {MongoClient} = require('mongodb')
require('dotenv').config()
const client = new MongoClient(process.env.MONGODB_URL);
const dbName = 'sample_airbnb';
const collection = 'listingsAndReviews';

const connectToDatabase = async ()=>{
    try{
        await client.connect();
        console.log('Connected to database successfully!')
    }catch(err){
        console.log('Error connecting to database');
    }
}

const main = async (req, res) =>{
    try{
        const listingsAndReviewsCollection = client.db(dbName).collection(collection);
        let {propertytype=["Apartment"],bedrooms=1, bathrooms=1, ajax=0} = req.query;
        
        if(!(propertytype instanceof Array)){
            propertytype = [propertytype];
        }
        console.log(propertytype);
        console.log(bedrooms);
        console.log(bathrooms);
        console.log(ajax);
        //const result = await listingsAndReviewsCollection.find({"address.market":"Sydney"});
        let query = [
            {
                $match:{
                    "address.market":"Sydney",
                    bedrooms:{$gte:Number(bedrooms)},
                    bathrooms:{$gte:Number(bathrooms)},
                    property_type:{$in:propertytype}
                }
            },
            {
                $limit:10
            },
            {
                $project:{
                    name:1,
                    bedrooms:1,
                    bathrooms:1,
                    price:1,
                    "images.picture_url":1,
                    "address.street":1
                },
            },
        ];
        //console.log(query);
        const result = await listingsAndReviewsCollection.aggregate(query);
        let output = [];
        for await (const doc of result){
            //console.log(doc);
            output.push(doc);
        }
        //return output;
        console.log(`Ajax=${ajax}`);
        if(Number(ajax) === 1){
            console.log('Inside if');
            //console.dir(query);
            //console.log(output);
            res.json(output);
        }else{
            console.log('Inside else');
            res.render('places', {output});
        }
    }catch(err){
        console.log(`Error fetching documents: ${err}`);
    }
}

const listing = async (req, res)=>{
    try{
        const listingsAndReviewsCollection = client.db(dbName).collection(collection);
        let query = [
            {
              $match: {
                _id: req.params.listingId,
              },
            },
            {
              $project: {
                name: 1,
                description: 1,
                bedrooms: 1,
                bathrooms: 1,
                amenities: 1,
                images: 1,
                host: 1,
                price:1
              },
            },
          ];
        const result = await listingsAndReviewsCollection.aggregate(query);
        let output = [];
        for await (const doc of result){
            //console.log(doc);
            output.push(doc);
        }
        res.render('listings', {output});
    }catch(err){
        console.log('Error ', err);
    }
}

module.exports = {
    connectToDatabase, main, listing
}
