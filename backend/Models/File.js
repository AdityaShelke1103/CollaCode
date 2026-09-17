const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },

        fileName: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            default: "",
        },
        lastModifiedBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model(
    "File",
    fileSchema,
    "File"
);

module.exports = File;