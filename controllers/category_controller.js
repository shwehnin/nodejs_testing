const db = require("../models/category_model");
const response = require("../utils/response");

let create = async(req, res, next) => {
    try{
        let data = req.body;
        var result = await db(data).save();
        let saveData = await db.findById(result._id).select("-__v");
        if(result) {
            response.success(res, {status: 201, message: "Category successfully created!", data: saveData});
        }else {
            response.throwError({message: "Opps! something went wrong", status: 502});
        }
    }catch(e) {
        next(e);
    }
}

let categories = async(req, res, next) => {
    try{
        let result = await db.find().select("-__v");
        if(result) {
            response.success(res, {status: 200, message: "Categories List", data: result});
        }else {
            response.throwError({message: "Opps! something went wrong", status: 502});
        }
    }catch(e) {
        next(e);
    }
}

let categoryId = async(req, res, next) => {
    try{
        let data = req.params;
        let result = await db.findById(data.slug).select("-__v");
        if(result) {
            response.success(res, {status: 200, message: "Category by Id", data: result});
        }else {
            response.throwError();
        }
    }catch(e){
        next(e);
    }
}

let update = async(req, res, next) => {
    try{
        let data = req.params;
        let result = await db.findByIdAndUpdate(data.slug, req.body).select("-__v");
        if(result) {
            let updateData = await db.findById(data.slug);
            response.success(res, {status: 200, message: "Category successfully updated!", data:result});
        }else {
            response.throwError();
        }
    }catch(e){
        next(e);
    }
}

let deleteCategory = async(req, res, next) => {
    try {
        let data = req.params;
        let result = await db.findByIdAndRemove(data.slug).select("-__v");
        if(result) {
            response.success(res, {
                status: 200,
                message: "Category successfully deleted!",
                data: result
            });
        }else {
            response.throwError();
        }
    }catch(e){
        next(e);
    }
}

module.exports = {
    create,
    categories,
    categoryId,
    update,
    deleteCategory,
}