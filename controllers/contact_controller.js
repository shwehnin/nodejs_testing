const db = require("../models/contact_model");
const response = require("../utils/response");

let create = async (req, res, next) => {
  try {
    let data = req.body;
    data.author = req.user._id;
    var result = await db(data).save();
    let savedData = await db.findById(result._id).select("title body author");
    if (result) {
      response.success(res, {
        status: 201,
        message: "New Contact Created",
        data: savedData,
      });
    } else {
      response.throwError({
        message: "Opps! Something is not right!",
        status: 502,
      });
    }
  } catch (e) {
    next(e);
  }
};

let contacts = async (req, res, next) => {
  try {
    // console.log(req.useragent);

    // if(!req.useragent.isMobile){

    //     response.throwError({message:"You can't req this route "});
    // }

    let result = await db
      .find()
      .populate({
        path: "author",
        select: "-__v -password",
        populate: { path: "favCat", select: "-__v" },
      })
      .select("-__v")
      .sort({ createdAt: -1 });

    if (result) {
      response.success(res, {
        status: 200,
        message: "Contact List",
        data: result,
      });
    } else {
      throw new Error("Server Error");
    }
  } catch (e) {
    next(e);
  }
};

let contactId = async (req, res, next) => {
  try {
    const getId = req.params;
    var result = await db.findById(getId.id).select("-__v");
    if (result) {
      response.success(res, {
        status: 200,
        message: "Contact by Id",
        data: result,
      });
    } else {
      response.throwError();
    }
  } catch (e) {
    next(e);
  }
};

let update = async (req, res, next) => {
  try {
    const getId = req.params;
    var result = await db.findByIdAndUpdate(getId.id, req.body);
    if (result) {
      let updateData = await db.findById(result._id).select("title body");
      response.success(res, {
        status: true,
        message: "Update Contact",
        data: updateData,
      });
    } else {
      throw new Error("Server Error");
    }
  } catch (e) {
    next(e);
  }
};

let deleteContact = async (req, res, next) => {
  try {
    const getId = req.params;
    var result = await db.findByIdAndDelete(getId.id).select("title body");
    if (result) {
      res.status(200).json({
        status: true,
        message: "Delete Contact",
        data: result,
      });
    } else {
      throw new Error("Server Error");
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  contacts,
  contactId,
  update,
  deleteContact,
};
