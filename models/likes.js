const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likes = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    likes:{
        type: Number
    }
})


module.exports = mongoose.model('likes', likes)