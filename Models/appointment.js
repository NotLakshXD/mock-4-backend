const mongoose = require('mongoose');
const appointmentSchema = mongoose.Schema({
    name: String,
    image: String,
    specialization: { type: String, enum: ["Cardiologist", "Dermatologist", "Pediatrician", "Psychiatrist"] },
    experience: Number,
    location: String,
    date: { type: Date, default: Date() },
    slots: Number,
    fee: Number
}, {
    versionKey: false
})
const Appointment = mongoose.model("appointment", appointmentSchema)
module.exports = Appointment;