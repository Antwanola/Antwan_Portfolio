const mongoose = require('mongoose')
const Schema = mongoose.Schema

comment = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:'projects',
        required:true
        
    },

    comment:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('comments', comment)