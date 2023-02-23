const db = require("../models/user_model");
const helper = require("../utils/helper");
const response = require("../utils/response");

let signup = async(req, res, next) => {
    try {
        let data = req.body;
        let checkEmail = await db.findOne({email: data.email});
        if(checkEmail) {
            response.throwError({ message: "email is already in use" });
        }
        data.role = "user";
        data.password = helper.encodePassword(data.password);
        var result = await db(data).save();
        var object = result.toObject();
        let userData = await db.find(result._id).select("name email role");
        delete object["password"];
        delete object.role;
        if(result) {
            response.success(res, {
                status: 201,
                message: "Register success!",
                data: object,
            })
        }else {
            response.throwError({
                message: "Opps! Something is not right!",
                status: 502,
            });
        }
    }catch(e) {
        next(e);
    }
}

let signin = async(req, res, next) => {
    try{
        let data = req.body;
        let email = data.email;
        let password = data.password;
        let user = await db.findOne({email: email});
        if(user) {
            if(helper.comparePassword(password, user.password)) {
                let object = user.toObject();
                delete object.password;
                delete object.role;
                let token = helper.makeToken(object);
                let loginUser = await db.findById(user.id).select("name email");
                let loginData = {
                    user: loginUser,
                    token: token
                }
                response.success(res, {
                    status: 200,
                    message: "Login success!",
                    data: loginData,
                });
            }else {
                response.throwError({ status: 400, message: "Wrong password!" });
            }
        }else {
            response.throwError({ status: 404, message: "User not found!" });
        }
    } catch(e) {
        next(e);
    }
}

let users = async(req, res, next) => {
    try{
        let result = await db.find().select("name email");
        if(result) {
            response.success(res, {
                status: 200,
                message: "User Lists",
                data: result,
            })
        }else {
            response.throwError();
        }
    }catch(e) {
        next(e);
    }
}

let update = async(req, res, next) => {
    try{
        let data = req.params;
        let result = await db.findByIdAndUpdate(data.id, req.body);
        if(result) {
            let updateData = await db.findById(result._id).select("name email");
            response.success(res, {
                status: 200,
                message: "User data updated!",
                data: updateData,
            });
        }else {
            response.throwError();
        }
    }catch(e) {
        next(e);
    }
}

let deleteUser = async(req, res, next) => {
    try{
        let data = req.params;
        let result = await db.findById(data.id).select("name email");
        if(result) {
            response.success(res, {
                status: 200,
                message: "User data deleted!",
                data: result,
            });
        }else {
            response.throwError();
        }
    }catch(e) {
        next(e);
    }
}

let getAdmin = async(req, res, next) => {
    try {
        let result = await db.find({role: "admin"}).select("name email");
        if(result) {
            response.success(res, {
                status: 200,
                message: "Admin List",
                data: result,
            });  
        }else {
            response.throwError({status: 404, message: "Wrong"});
        }
    }catch(e) {
        next(e);
    }
}

let getAdminOwner = async(req, res, next) => {
    try{
        let result = await db.find({$or: [{role: "admin"}, {role: "owner"}]});
        if(result) {
            response.success(res, {
                status: 200,
                message: "Admin & Owner List",
                data: result,
            });  
        }else {
            response.throwError({status: 404, message: "Data not found!"});
        }
    }catch(e) {
        next(e);
    }
}

let addAuthUser = async(req, res, next) => {
    try {
        var data = req.body;
        let checkEmail = await db.findOne({email: data.email});
        if(checkEmail) {
            response.throwError({status: 422, message: "Email alreay exists"});
        }
        data.role = "Admin";
        let result = await db(data).save();
        if(result) {
            response.success(res, {
                status: 200,
                message: "Admin success!",
                data: result,
            }); 
        }else {
            response.throwError({status: 404, message: "Data not found!"});
        }
    }catch(e) {
        next(e);
    }
}

module.exports = {
    signup,
    signin,
    users,
    update,
    deleteUser,
    getAdmin,
    getAdminOwner,
    addAuthUser,
}