const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Appointment = require('../Models/appointment');
const User = require('../Models/user.model');
const AuthMiddlware = require('../Middleware/Auth.middleware');
router.get("/", (req, res) => {
    res.send("Welcome to Doctor Appointment App (By Laxya Rupeja)")
})
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 2);
        const user = User({ email, password: hash });
        await user.save();
        res.json({ msg: "User registered succesfully", user });
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const isExits = await User.findOne({ email });
        if (!isExits) {
            res.status(404).json({ msg: "User doesn't exist with this email" });
            return;
        }
        bcrypt.compare(password, isExits.password, function (err, result) {
            if (err) {
                console.log(err)
                res.status(404).json({ msg: "Something went wrong", err })
                return;
            }
            if (result) {
                var token = jwt.sign({ userId: isExits._id }, 'shhhhh');
                res.json({ token });
            }
            else {
                res.status(404).json({ msg: "wrong password" })
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.get("/appointment", AuthMiddlware, async (req, res) => {
    const { search, filter, sort } = req.query;
    try {
        if (search) {
            const appointments = await Appointment.find({ name: { $regex: search, $options: "i" } });
            res.json({ appointments })
        }
        if (filter && sort) {
            const appointments = await Appointment.find({ specialization: filter }).sort({
                date: sort
            });
            res.json({ appointments })
        }
        else if (filter) {
            const appointments = await Appointment.find({ specialization: filter });
            res.json({ appointments })
        }
        else if (sort) {
            const appointments = await Appointment.find().sort({
                date: sort
            });
            res.json({ appointments })
        }
        else {
            const appointments = await Appointment.find();
            res.json({ appointments })
        }
        // res.json(appointments);
    } catch (error) {
        res.status(404).json({ msg: "Something went wrong", error })

    }
})
router.post("/appointment", AuthMiddlware, async (req, res) => {
    const { name, image, specialization, experience, location, slots, fee } = req.body;
    try {
        const appointment = new Appointment({ name, image, specialization, experience, location, slots, fee })
        await appointment.save();
        res.json({ appointment });

    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.patch("/appointment/:id", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const editAppointment = await Appointment.findByIdAndUpdate(id, req.body);
        res.json({ editAppointment })
    } catch (error) {
        res.status(404).json({ msg: "Something went wrong", error })

    }
})
router.delete("/appointment/:id", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteAppointment = await Appointment.findByIdAndDelete(id);
        res.json({ deleteAppointment })
    } catch (error) {
        res.status(404).json({ msg: "Something went wrong", error })

    }
})
module.exports = router
