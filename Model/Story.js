const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StorySchema = new Schema({

    story:[{
        caption: {
            type: String,
            required: true,
        },
        imgUri:{
            type:String,
            required: true
        },
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });



module.exports = mongoose.model('Story', StorySchema);