const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Appointment schema
const appointmentSchema = new Schema({
    farmerId: {
        type: Schema.Types.String,
        required: true
    },
    issueDescription: {
        type: Schema.Types.String,
        required: true
    },
    issueImages: {
        type: [Schema.Types.String], // Array of image URLs or file paths
        default: []
    },
    appointmentTime: {
        type: Schema.Types.Date,
        required: false
    },
    status: {
        type: Schema.Types.String,
        enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    expertId: {
        type: Schema.Types.String,
        default: null // Null if no expert is assigned yet
    },
    notes: {
        type: Schema.Types.String,
        default: '' // Default to an empty string if no notes are provided
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
