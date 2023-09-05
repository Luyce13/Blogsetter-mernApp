const mongoose = require('mongoose')

const blogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title:
        {
            type: String,
            required: [true, 'Please add a title'],
        },
        subTitle:
        {
            type: String,
            required: [true, 'Please add subTitle'],
        },
        description:
        {
            type: String,
            required: [true, 'Please add description'],
        },
        tags:
        {
            type: Array,
            required: [true, 'Please add tags'],
        },
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('Blog', blogSchema)