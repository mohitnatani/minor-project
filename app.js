const express = require('express');
const cookieParser = require('cookie-parser');

const {cloudinary, upload} = require('./cloudinaryConfig');
const {initDB} = require('./dbConfig');

const {getListing, getListingByID, createListing, updateListingByID, deleteListingByID} = require('./controllers/propertyContoller');
const {signup, login, logout} = require('./controllers/authController');
const {getBooking,cancelBooking,confirmBooking} = require('./controllers/bookingController');

require('dotenv').config();
//const {connectToDatabase, main, listing} = require('./models/listingsAndReviews')
const {main, listing} = require('./controllers/listingController');

const app = express();
initDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(cookieParser());

//connectToDatabase();


//app.get('/sydney', main);
//app.get('/listing/:listingId', listing);

app.get('/', (req, res)=>{
    res.render('home');
})
app.get('/property/:cityname', main);
app.get('/listing/:listingId', listing);


//Auth
app.get('/login', (req, res)=>{
    const token = req.cookies.jwt
    if (token) {
        res.render('login', {logged:true});
    }else{
        res.render('login', {logged:false});
    }
})
app.post('/login', login);
app.get('/signup', (req, res)=>{
    const token = req.cookies.jwt
    if (token) {
        res.render('signup', {logged:true});
    }else{
        res.render('signup', {logged:false});
    }
})
app.post('/signup', signup);
app.get('/logout', logout);

//Listing
app.get('/propertylisting', getListing);
app.get('/propertylisting/:propertyID', getListingByID);
app.get('/createproperty', createListing);
app.post('/createproperty', upload.single('image'), createListing);
//app.post('/propertylisting', upload.single('image'), createListing);
//app.put('/propertylisting/:propertyID', upload.single('image'), updateListingByID);
app.get('/updateproperty/:propertyID', getListingByID);
app.post('/updateproperty/:propertyID', upload.single('image'), updateListingByID);
//app.delete('/propertylisting/:propertyID', deleteListingByID);
app.get('/deleteproperty/:propertyID', deleteListingByID);

//Booking
app.get('/booking', getBooking);
app.get('/confirmbooking', confirmBooking);
app.get('/cancelbooking/:bookingID', cancelBooking);

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('Server started successfully!')
})