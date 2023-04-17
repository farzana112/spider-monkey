const mongoose = require('mongoose');
const parentSchema = new mongoose.Schema({
    id: {

        type: String,
        required: true
        
    },
    category: {
        type: String,
        required: true
    }
    
}, {timestamps: true});
module.exports = mongoose.model('Parent', parentSchema);
