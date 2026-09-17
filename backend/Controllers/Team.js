const Team = require("../Models/Team");
const Member = require("../Models/Member");
const File = require("../Models/File");

const createTeam = async (req, res) => {
    try {
        const { teamName, memberId } = req.body;
        const team = await Team.create({
            teamName,
            members: [
                {
                    memberId: memberId
                }
            ],
            admins: [
                memberId
            ]
        });
        await Member.findOneAndUpdate(
            { memberId: memberId },
            {
                $push: {
                    teams: {
                        teamId: team._id,
                        isAdmin: true
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        return res.status(201).json({
            message: "Team created successfully",
            team
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error creating team",
            error: error.message

        });

    }
};



const joinTeam = async (req, res) => {
    try {
        const { joinCode, memberId } = req.body;
        const team = await Team.findById(joinCode);

        if (!team) {
            return res.status(404).json({
                message: "Invalid team code",
            });
        }
        const alreadyMember = team.members.some(
            (member) => member.memberId === memberId
        );
        if (alreadyMember) {
            return res.status(400).json({
                message: "You are already a member of this team",
            });
        }
        team.members.push({
            memberId,
        });
        await team.save();
        await Member.findOneAndUpdate(
            { memberId },
            {
                $push: {
                    teams: {
                        teamId: team._id,
                        isAdmin: false,
                    },
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return res.status(200).json({
            message: "Successfully joined the team",
            teamId: team._id,
            teamName: team.teamName,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error joining team",
            error: error.message,
        });
    }
};

const leaveTeam = async (req, res) => {
    try {
        const { teamId, memberId } = req.body;
        await Team.findByIdAndUpdate(
            teamId,
            {
                $pull: {
                    members: {
                        memberId
                    }
                },
                admins: memberId
            }
        );
        await Member.findOneAndUpdate(
            { memberId },
            {
                $pull: {
                    teams: {
                        teamId
                    }
                }
            }
        );
        return res.status(200).json({
            message: "Successfully left the team"
        });
    }
    catch (error) {
        return ress.status(500).json({
            message: "Error leaving team",
            error: error.message
        });
    }
};


const getTeamFiles = async (req, res) => {
    try {
        const { teamId } = req.params;

        console.log("TEAM ID RECEIVED:", teamId);

        const files = await File.find({ teamId });

        console.log("FILES FOUND:", files);

        return res.status(200).json({
            files
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error fetching files",
            error: error.message
        });
    }
};

const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        return res.status(200).json({
            members: team.members
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching team members",
            error: error.message
        });
    }
};

module.exports = { createTeam, joinTeam, leaveTeam, getTeamFiles, getTeamMembers };