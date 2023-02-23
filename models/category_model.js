const mongoose = require("mongoose");
const {Schema} = mongoose;
const Category = new Schema(
    {
        name: {type: String, required:true},
        description: {type:String, required:false,default:null},
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("category", Category);