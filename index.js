require("dotenv").config();
const express = require("express");
// var useragent = require('express-useragent');
const app = express();
const port = process.env.PORT || 6001;

//file upload
const fileUpload = require("express-fileupload");
const path = require("path");

const mongoose = require("mongoose");
const dbURL = `mongodb://127.0.0.1:27017/${process.env.DBNAME}`;

mongoose.set("strictQuery", true);
mongoose.connect(dbURL, {});

const uploadedFiles = express.static(path.join(__dirname, "uploads"));
app.use(fileUpload());
app.use(express.json());

const contactRouter = require("./routes/contact_route");
const userRouter = require('./routes/user_route');
const categoryRouter = require('./routes/category_route');
const pdfRouter = require("./routes/pdf_route");

app.use("/uploads", uploadedFiles);

// app.use(useragent.express());
app.use("/contacts", contactRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/pdf",pdfRouter);

//unknown route
app.use('*', (req, res, next) => {
    let err = new Error("Route not found");
    err.status = 404;
    next(err);
})

//error handler
app.use((err, req, res, next) => {
    var code = err.status || 500;
    console.log(err)
    res.status(code).json({
        status:false,
        message: err.message,
        data: null,
    });
});

app.listen(port, () => console.log(`Server is running at ${port}`));