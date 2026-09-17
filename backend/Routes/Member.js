const express = require("express");
const router = express.Router();

const {
    getMember,
    addMember,
    removeMember,
    makeAdmin,
    removeAdmin,
    getMemberTeams
} = require("../Controllers/Member");

router.get("/:memberId", getMember);

router.post("/add", addMember);
router.post("/remove", removeMember);

router.put("/make-admin", makeAdmin);
router.put("/remove-admin", removeAdmin);

router.get("/teams/:memberId", getMemberTeams);

module.exports = router;