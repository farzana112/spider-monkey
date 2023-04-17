const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    id: {

        type: String,
        required: true
        
    },
    category: {
        type: String,
        required: true
    },
    parent:{

        type: String,
        required: true
    }
}, {timestamps: true});
module.exports = mongoose.model('Category', categorySchema);
