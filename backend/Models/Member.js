const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        memberId: {
            type: String,
            required: true,
            unique: true,
        },

        teams: {
            type: [
                {
                    teamId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Team",
                        required: true,
                    },

                    isAdmin: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Member = mongoose.model(
    "Member",
    memberSchema,
    "Member"
);

module.exports = Member;