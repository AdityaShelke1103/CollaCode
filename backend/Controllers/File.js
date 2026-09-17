const File = require("../Models/File");
const Team = require("../Models/Team");

const createFile = async (req, res) => {
    try {
        const { teamId, fileName, code, lastModifiedBy } = req.body;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const file = await File.create({
            teamId,
            fileName,
            code,
            lastModifiedBy
        });

        team.files.push(file._id);
        await team.save();

        return res.status(201).json({
            message: "File created successfully",
            file
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating file",
            error: error.message
        });
    }
};

const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        return res.status(200).json({
            file
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching file",
            error: error.message
        });
    }
};


const updateFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { code, memberId } = req.body;

        const file = await File.findByIdAndUpdate(
            fileId,
            {
                code,
                lastModifiedBy: memberId,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        return res.status(200).json({
            message: "File updated successfully",
            file
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating file",
            error: error.message
        });
    }
};


const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        await Team.findByIdAndUpdate(file.teamId, {
            $pull: {
                files: file._id
            }
        });

        await File.findByIdAndDelete(fileId);

        return res.status(200).json({
            message: "File deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting file",
            error: error.message
        });
    }
};

const renameFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { fileName } = req.body;

        const file = await File.findByIdAndUpdate(
            fileId,
            { fileName },
            { new: true }
        );

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        return res.status(200).json({
            message: "File renamed successfully",
            file
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error renaming file",
            error: error.message
        });
    }
};

module.exports = {
    createFile,
    getFile,
    updateFile,
    deleteFile,
    renameFile
};