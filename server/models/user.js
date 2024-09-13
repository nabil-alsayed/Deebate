// Mongoose Schema / Model for User

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
    emailAddress: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    profilePicture: {
        type: Image,
    },
    debates: [{
        type: Schema.Types.ObjectId, ref: "Course"
    }]
});

module.exports = mongoose.model("User", UserModel);