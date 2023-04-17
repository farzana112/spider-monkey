 const multer = require('multer')
// const Storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });
// const addBanner = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });


const addBanner = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});


// module.exports={
//     addBannerupload: multer({ addbBannerUpload: addBannerUpload }).single('image'),


// }
module.exports = {
    
    addBannerupload: multer({ storage: addBanner }).single('image')
  };
