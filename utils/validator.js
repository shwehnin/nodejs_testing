const ObjectId = require("mongoose").Types.ObjectId;
const Helper = require("./helper");
const response = require("../utils/response");

exports.validateBody = (schema) => {
    return (req, res, next) => {
        let result = schema.validate(req.body);
        if(result.error) {
            let errorMessage = result.error.details[0].message.split('"').join("");
            next(new Error(errorMessage));
        }else {
            next();
        }
    }
}

exports.validateMongoId = () => {
    return (req, res, next) => {
        if(!ObjectId.isValid(req.params.id)) {
            next(new Error(`Invalid request data`));
        }else {
            next();
        }
    }
}

exports.validateQuery = (queryName) => {
    return (req, res, next) => {
        if(req.query[`${queryName}`] == undefined) {
            next(new Error("Invalid request data"));
        }else {
            next();
        }
    }
}

exports.validateToken = () => {
    return (req, res, next) => {
        if(!req.headers.authorization) {
            next(response.throwError({message: "Token Invalid", status: 489}));
            return;
        }
        let token = req.headers.authorization.split(" ")[1];
        if(token) {
            try {
                let user = Helper.decodeToken(token);
                if(user) {
                    req.user = user;
                    next();
                }else {
                    next(response.throwError);
                }
            }catch(error) {
                next(response.throwError);
            }
        }else {
            next(response.throwError);
        }
    }
}

exports.validateRole = (role) => {
    return (req, res, next) => {
        let valid;
        if(!req.headers.authorization) {
            next(new Error("Tokenization Error"));
            return;
        }
        let token = req.headers.authorization.split(" ")[1];
        req.user = Helper.decodeToken(token);
        for(const rol of role) {
            if(req.user.role == rol) {
                valid = true;
            }
        }
        if(valid) {
            next();
        }else {
            next(new Error("You don't have this permission"));
        }
    }
}