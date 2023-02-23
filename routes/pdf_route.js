const router = require("express").Router();
const controller = require("../controllers/pdf_controller");

router.get("/", [controller.pdfGenerate]);
router.get("/file", [controller.pdfExport]);

module.exports = router;