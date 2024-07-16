const mongoose = require("mongoose");

// Schema
const studentDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    hobbies: {
        type: String, // Storing hobbies as a single string
        required: true,
        enum: ['Reading', 'Sports', 'Music', 'Coding', 'Art', 'Volunteering'] // Enumerating possible values
    },
    topics: {
        type: String, // Storing topics as a single string
        required: true,
        enum: ['Science', 'Mathematics', 'Literature', 'Social Studies', 'Technology'] // Enumerating possible values
    },
    participation: {
        type: String,
        required: true,
        enum: ['Not interested', 'Somewhat interested', 'Very interested'] // Enumerating possible values
    },
    extracurriculars: {
        type: String,
        required: true,
        enum: ['debate', 'quiz', 'NSS', 'hackathon', 'arts'] // Enumerating possible values
    },
    time: {
        type: String,
        required: true,
        enum: ['Less than 2 hours', '2-4 hours', '4-6 hours', 'More than 6 hours'] // Enumerating possible values
    },
    club:{
        type: String,
        
    },
}, { timestamps: true }); // Adding timestamps

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);

module.exports = StudentDetails;
