const multer = require('multer');
const cloudinary = require('cloudinary').v2;

//config - cloudinary
cloudinary.config({
    cloud_name: 'dexo6fw1q',
    api_key:'638277832555562',
    api_secret:'KlQGCclFVrgG8TWDvvFGccRIE9w'
});

const upload = multer({
    storage:multer.memoryStorage()
});

module.exports = {
    cloudinary, upload
}