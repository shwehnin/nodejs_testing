const router = require("express").Router();
const controller = require("../controllers/category_controller");
const {validateBody, validateToken} = require("../utils/validator");
const {category_create} = require("../utils/validate_schema");

router.post("/create", [validateToken(), validateBody(category_create), controller.create]);
router.get("/", [controller.categories]);
router.route("/:slug")
.get([controller.categoryId])
.patch([controller.update])
.delete([controller.deleteCategory]);

module.exports = router;