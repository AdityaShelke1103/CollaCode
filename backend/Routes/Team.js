const express = require("express");
const router = express.Router();

const {
    createTeam,
    joinTeam,
    leaveTeam,
    getTeamFiles,
    getTeamMembers
} = require("../Controllers/Team");

router.post("/create", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
router.get("/:teamId", getTeamFiles);
router.get("/members/:teamId", getTeamMembers);

module.exports = router;