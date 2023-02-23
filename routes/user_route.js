const router = require("express").Router();
const controller = require("../controllers/user_controller");
const {validateBody, validateToken, validateMongoId, validateRole} = require("../utils/validator");
const {user_create} = require("../utils/validate_schema");

router.post("/signup", [validateBody(user_create),controller.signup]);
router.post("/login", [controller.signin]);
router.get("/", [controller.users]);
router.route("/:id")
.patch([
    controller.update
]).delete([
    controller.deleteUser
]);
router.get("/get-admin", [controller.getAdmin]);
router.get("/get-admin-owner", [controller.getAdminOwner]);
router.post("/add-admin", [controller.addAuthUser]);

module.exports = router;
