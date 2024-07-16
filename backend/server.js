const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const { PythonShell } = require('python-shell');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const pythonPath = 'python';
mongoose.connect(process.env.URI).then(() => {
    console.log("connected");
    app.listen(process.env.PORT || 4000, (err) => {
        console.log("running successfully at ", process.env.PORT)
    });
}).catch((error) => {
    console.log("error", error);
});

app.get("/", (req, res) => {
    res.send("API running");
});

app.post("/predict", async (req, res) => {
    const { name, hobbies, topics, participation, extracurriculars, time } = req.body;
    console.log("Request body:", req.body);
    const input = { hobbies, topics, extracurriculars };
    const encodedInput = JSON.stringify(input);
    console.log("Encoded input:", encodedInput);


    const scriptPath = path.join(__dirname, '../ml/predict.py');
    console.log("Script path:", scriptPath);

    const pythonOptions = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: path.dirname(scriptPath)
    };

    const pythonShell = new PythonShell(path.basename(scriptPath), pythonOptions);

    pythonShell.send(encodedInput);
    let predictedClub;
    pythonShell.on('message', (message) => {
        console.log("Python script message:", message);
        predictedClub = message.trim();
    });

    pythonShell.end((err, code, signal) => {
        if (err) {
            console.error('Error predicting club:', err);
            return res.status(500).json({ message: 'Error predicting club' });
        }

        console.log('Python script finished with code', code, 'and signal', signal);
        console.log(predictedClub);
        const user = new User({
            name,
            hobbies,
            topics,
            participation,
            extracurriculars,
            time,
            club: predictedClub
        });
        console.log(user);
        user.save()
            .then(() => {
                res.status(201).json({ message: "Student details saved successfully", club: predictedClub });
                console.log("User Saved");
            })
            .catch((error) => {
                res.status(400).json({ message: "Error saving student details", error });
            });
    });

});
app.get("/clubs", async (req, res) => {
    try {
        const clubs = await User.aggregate([
            { $group: { _id: "$club", count: { $sum: 1 } } }
        ]);
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching club data", error });
    }
});


app.get("/search", async (req, res) => {
    const { name } = req.query;
    try {
        const students = await User.find({ name: new RegExp(name, 'i') });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching student details' });
    }
});