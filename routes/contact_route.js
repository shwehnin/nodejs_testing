const router = require("express").Router();
const controller = require("../controllers/contact_controller");
const {validateBody, validateToken, validateMongoId, validateRole} = require("../utils/validator");
const {contact_create} = require("../utils/validate_schema");
const {save} = require("../utils/uploader");

router.get("/", [controller.contacts]);
router.post("/add", [
    validateToken(),
    validateBody(contact_create),
    save,
    controller.create,
]);
router.route("/:id/:app")
.get([controller.contactId])
.patch([validateMongoId(), controller.update])
.delete([validateToken(), validateRole(["admin"]), controller.deleteContact]);

module.exports = router;