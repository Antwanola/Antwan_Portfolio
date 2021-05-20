const  mongoose = require('mongoose');
const  Schema =  mongoose.Schema;




const category = new Schema({

    category:{
        type: String
    },

    message:{
        type: String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('categories', category)