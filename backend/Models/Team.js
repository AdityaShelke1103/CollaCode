const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        teamName: {
            type: String,
            required: true,
            trim: true,
        },

        files: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "File",
                },
            ],
            default: [],
        },

        members: {
            type: [
                {
                    memberId: {
                        type: String,
                        required: true,
                    },
                },
            ],
            default: [],
        },

        admins: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Team = mongoose.model(
    "Team",
    teamSchema,
    "Team"
);
module.exports = Team;