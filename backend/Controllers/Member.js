const Member = require("../Models/Member");
const Team = require("../Models/Team");

const getMember = async (req, res) => {

    try {

        const { memberId } = req.params;

        const member = await Member.findOne({ memberId });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        return res.status(200).json({
            member
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching member",
            error: error.message
        });

    }

};

const addMember = async (req, res) => {
    try {
        const {
            teamId,
            adminId,
            newMemberId
        } = req.body;
        const admin = await Member.findOne({
            memberId: adminId
        });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }
        const teamInfo = admin.teams.find(
            (team) =>
                team.teamId.toString() === teamId
        );
        if (!teamInfo || !teamInfo.isAdmin) {
            return res.status(403).json({
                message: "You are not an admin of this team"
            });
        }
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }
        const alreadyMember = team.members.some(
            (member) =>
                member.memberId === newMemberId
        );
        if (alreadyMember) {
            return res.status(400).json({
                message: "Member is already in this team"
            });
        }
        team.members.push({
            memberId: newMemberId
        });
        await team.save();
        await Member.findOneAndUpdate(
            {
                memberId: newMemberId
            },
            {
                $push: {
                    teams: {
                        teamId: team._id,
                        isAdmin: false
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        return res.status(200).json({
            message: "Member added successfully"
        });
    } catch (error) {

        return res.status(500).json({
            message: "Error adding member",
            error: error.message
        });
    }
};

const removeMember = async (req, res) => {

    try {

        const {
            teamId,
            adminId,
            memberId
        } = req.body;


        // Check admin
        const admin = await Member.findOne({
            memberId: adminId
        });


        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }


        const teamInfo = admin.teams.find(
            (team) =>
                team.teamId.toString() === teamId
        );


        if (!teamInfo || !teamInfo.isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to remove members"
            });
        }


        // Remove member from Team
        await Team.findByIdAndUpdate(

            teamId,

            {
                $pull: {
                    members: {
                        memberId: memberId
                    }
                }
            }

        );


        // Remove Team from Member
        await Member.findOneAndUpdate(

            {
                memberId: memberId
            },

            {
                $pull: {
                    teams: {
                        teamId: teamId
                    }
                }
            }

        );


        return res.status(200).json({
            message: "Member removed successfully"
        });


    } catch (error) {

        return res.status(500).json({
            message: "Error removing member",
            error: error.message
        });

    }

};

const makeAdmin = async (req, res) => {

    try {

        const {
            teamId,
            adminId,
            memberId
        } = req.body;


        // Verify requesting user is admin
        const admin = await Member.findOne({
            memberId: adminId
        });


        const teamInfo = admin?.teams.find(
            (team) =>
                team.teamId.toString() === teamId
        );


        if (!teamInfo || !teamInfo.isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to make admins"
            });
        }


        // Update Member document
        await Member.updateOne(

            {
                memberId: memberId,
                "teams.teamId": teamId
            },

            {
                $set: {
                    "teams.$.isAdmin": true
                }
            }

        );


        // Add member to Team admins
        await Team.findByIdAndUpdate(

            teamId,

            {
                $addToSet: {
                    admins: memberId
                }
            }

        );


        return res.status(200).json({
            message: "Member is now an admin"
        });


    } catch (error) {

        return res.status(500).json({
            message: "Error making member admin",
            error: error.message
        });

    }

};



// REMOVE ADMIN
const removeAdmin = async (req, res) => {

    try {

        const {
            teamId,
            adminId,
            memberId
        } = req.body;


        // Verify requesting user is admin
        const admin = await Member.findOne({
            memberId: adminId
        });


        const teamInfo = admin?.teams.find(
            (team) =>
                team.teamId.toString() === teamId
        );


        if (!teamInfo || !teamInfo.isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to remove admins"
            });
        }


        // Update Member document
        await Member.updateOne(

            {
                memberId: memberId,
                "teams.teamId": teamId
            },

            {
                $set: {
                    "teams.$.isAdmin": false
                }
            }

        );


        // Remove from Team admins
        await Team.findByIdAndUpdate(

            teamId,

            {
                $pull: {
                    admins: memberId
                }
            }

        );


        return res.status(200).json({
            message: "Admin privileges removed"
        });


    } catch (error) {

        return res.status(500).json({
            message: "Error removing admin",
            error: error.message
        });

    }

};

const removeMemberAdmin = async (req, res) => {
    try {
        const { teamId, adminId, memberId } = req.body;

        const admin = await Member.findOne({ memberId: adminId });

        const teamInfo = admin?.teams.find(
            team => team.teamId.toString() === teamId
        );

        if (!teamInfo || !teamInfo.isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to remove members"
            });
        }

        await Team.findByIdAndUpdate(teamId, {
            $pull: {
                members: { memberId }
            }
        });

        await Member.findOneAndUpdate(
            { memberId },
            {
                $pull: {
                    teams: { teamId }
                }
            }
        );

        return res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error removing member",
            error: error.message
        });
    }
};

const getMemberTeams = async (req, res) => {
    try {
        const { memberId } = req.params;
        const member = await Member
            .findOne({ memberId })
            .populate("teams.teamId");

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }
        return res.status(200).json({
            teams: member.teams
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error fetching teams",
            error: error.message
        });
    }
};



module.exports = {

    getMember,
    addMember,
    removeMember,
    makeAdmin,
    removeAdmin,
    removeMemberAdmin,
    getMemberTeams
};