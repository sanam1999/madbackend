const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FoodPostSchema = new Schema({

    imgUri:{
        type:String,
        required: true
    },
    location: {
        type:String,
        required: true
    },
    quantity: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    foodName:{
        type:String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    poststaus:{
        type:String,
        enum: ['Runnig', 'Teken','Volunteer'],
        default:"Volunteer",
    }
}, { timestamps: true });



module.exports = mongoose.model('FoodPost', FoodPostSchema);