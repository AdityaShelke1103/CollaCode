require("dotenv").config();

const connectDB = require("./db");
const Team = require("./Models/Team");

const testDatabase = async () => {
    try {
        await connectDB();

        const testTeam = await Team.create({
            teamName: "Code Wizards",

            teamId: 1,

            code: `function hello() {
    console.log("Hello from the Collaborative Code Editor!");
}`,

            members: [
                {
                    userId: "firebase-user-id-123",
                },
                {
                    userId: "firebase-user-id-456",
                },
                {
                    userId: "firebase-user-id-789",
                },
            ],
        });

        console.log("Team created successfully:");
        console.log(testTeam);

    } catch (error) {
        console.error("Error:", error.message);
    }
};

testDatabase();