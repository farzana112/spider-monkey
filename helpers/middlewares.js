const multer = require('multer');
const path  = require('path')
// const categoryModel = require('../models/categorySchema');

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'./uploads');
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+ '-' + Date.now() + path.extname(file.originalname));
    }
});

const editedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+ '-' + Date.now() + path.extname(file.originalname));
    }


})



 const uploads = multer({storage:storage})

 const editeduploads=multer({storage:editedStorage})
module.exports = {uploads,editeduploads}


