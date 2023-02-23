const limitCount = Number(process.env.LIMIT_COUNT);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//hash password
let encodePassword = (password) => bcrypt.hashSync(password, 10);

//boolean
let comparePassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

//token
let makeToken = (payload) => jwt.sign(payload, process.env.SECRET_KEY);

//decode data
let decodeToken = (token) => jwt.decode(token, process.env.SECRET_KEY);

//pagination
let skipCount = (req) => {
    let count = 0;
    let params = req.query;
  
    ///if params contain page
    ///count assign
    if (params.page) {
      try {
        count =
          Number(params.page) <= 0
            ? 0
            : (Number(req.query.page) - 1) * limitCount;
      } catch (_) {
        count = 0;
      }
    } else {
      count = 0;
    }
    return count;
  };

module.exports = {
    skipCount, 
    limitCount,
    comparePassword,
    makeToken,
    decodeToken,
    encodePassword,
}