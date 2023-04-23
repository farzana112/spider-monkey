// const multer= require('multer');

// const Storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });
//                                  Banner addition


// const addBanner = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });



// const editBanner = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// module.exports={
// uploads:multer({storage:Storage}).single('images'),
// addBannerupload: multer({ storage: addBanner }).single('image'),
// editBannerupload: multer({ storage: editBanner }).single('image1'),

// }

// const multer = require('multer');
// const path  = require('path')

// const storage = multer.diskStorage({
//     destination : (request, file, callback)=>{
        
//         callback(null,'./uploads');

//     },
//     filename: (request,file,callback)=>{
//         callback(null,file.fieldname+ '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const imageFilter = (request, file, callback) => {
//     // to accept images only

//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//       return callback(null, false);
//     }else{

//         callback(null, true);
//     }

//   };
//   const addBanner = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });
  


// const uploads = multer({storage:storage,fileFilter:imageFilter})

//     module.exports = {uploads, addBannerupload:multer({storage:addBanner}).single('image')}


const multer = require('multer');
const path  = require('path')

const storage = multer.diskStorage({
    destination : (request, file, callback)=>{
        callback(null,'./uploads');
    },
    filename: (request,file,callback)=>{
        callback(null,file.fieldname+ '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (request, file, callback) => {
    // to accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(null, false);
    } else {
        callback(null, true);
    }
};

const addBanner = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const editBanner = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const uploads = multer({storage: storage, fileFilter: imageFilter})

module.exports = {
    uploads: uploads,
    addBannerupload: multer({storage: addBanner}).single('image'),
    editBannerupload:multer({ storage: editBanner }).single('image1')
};
