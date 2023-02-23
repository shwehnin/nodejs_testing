const response = require("../utils/response");
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require("handlebars");
const path = require("path");
const data = require("../data.json");
const ejs = require("ejs");
const uuid =require("uuid");
const pdf = require("html-pdf");
// const fss = require('fs');
const db = require("../models/user_model");
var contentDisposition = require('content-disposition')



let pdfGenerate = async(req, res, next) => {
    try{
        const users = await db.find();
        const data = {
            users: users
        }
        console.log(users);
        const filePathName = path.resolve(__dirname, '../simple.html');
        const htmlString = fs.readFileSync(filePathName).toString();
        let options = { format: 'A4' }
        const ejsData = ejs.render(htmlString, data);
        pdf.create(ejsData, options).toFile('users.pdf', (err, resp) => {
            if(err) {
                console.log(err);
            }
            console.log('file generated');
            const filePath = path.resolve(__dirname, '../users.pdf');
            fs.readFile(filePath, (err, file) => {
                if(err) {
                    return response.throwError({status: 500, message: "Could not download file!"});
                }
                res.setHeader('content-type', 'application/json');

                res.setHeader('Content-Disposition', contentDisposition("users.pdf"))
                res.send(file);
            })
            response.success({message:"success",data:filePath});
        });
    }catch(e) {
        next(e);
    }
}

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

let pdfExport = async(req, res, next) => {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('index', data);
        // const html = fs.readFileSync('simple.html', 'utf-8');
        await page.setContent(content);
        // await page.emulateMediaType('screen');

    //    const path=`../invoice/${uuid.v4()}.pdf`;
        const pdf = await page.pdf({
            path: `${uuid.v4()}.pdf`,
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
        });
        await browser.close();
        response.success(res,{message:"success",data:null});

    }catch(e) {
        next(e);
    }
}

module.exports = {
    pdfGenerate,
    pdfExport,
}