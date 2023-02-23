const mongoose = require("mongoose");
const {Schema} = mongoose;
const User = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        favCat:[{type:Schema.Types.ObjectId,ref:"category"}],
        role: {type: String, enum: ["user", "admin", "owner"], required: true}
    }, 
    {
        timestamps: true
    }
);


module.exports = mongoose.model("user", User);