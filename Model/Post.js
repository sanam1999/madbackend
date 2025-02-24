const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
    imgUri:{
        type:String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    totaldonate:{
        type:Number,
        default:0
    }
}, { timestamps: true });



module.exports = mongoose.model('Post', PostSchema);