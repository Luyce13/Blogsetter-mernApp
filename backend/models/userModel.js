const { strikethrough } = require('colors')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please Add A Name'],
        },
        email: {
            type: String,
            required: [true, 'Please Add A Name'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please Add A Name'],
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('User', userSchema)