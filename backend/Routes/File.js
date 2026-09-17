const express = require("express");
const router = express.Router();

const {
    createFile,
    updateFile,
    getFile,
    deleteFile,
    renameFile
} = require("../Controllers/File");

router.post("/create", createFile);
router.get("/:fileId", getFile);
router.put("/:fileId", updateFile);
router.delete("/:fileId", deleteFile);
router.put("/:fileId/rename", renameFile);

module.exports = router;