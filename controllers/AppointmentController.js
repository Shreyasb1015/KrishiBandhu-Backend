const Appointment = require("../models/AppointmentModel"); // Adjust the path to your Appointment model
const APIResponse = require("../utils/APIResponse");
const User = require("../models/UserModel");
// Add an appointment (only experts can set appointment time)
exports.add = async (req, res) => {
  try {
    const { issueDescription, notes } = req.body;

    const userId = req.user.userId;

    const issueImages = req.files.map((file) => file.path); // Path where images are stored

    const newAppointment = new Appointment({
      farmerId: userId,
      issueDescription,
      issueImages,
      notes,
      appointmentTime: null, // Appointment time is not set by the farmer
    });

    const savedAppointment = await newAppointment.save();
    res
      .status(201)
      .json(new APIResponse(null, "Appointment Added Successfully"));
  } catch (err) {
    res.status(500).json(new APIResponse(null, err.message));
  }
};

// Get appointments for a farmer or expert
exports.get = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const filter = {};

    if (role == "Farmer") {
      filter.farmerId = userId;
    } else if (role == "Expert") {
      filter.expertId = userId;
      filter.status = pending;
    }

    const appointments = await Appointment.find(filter);

    const updatedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        const farmer = await User.findById(apt.farmerId);
        const expert = await User.findById(apt.expertId);
        
        if (farmer) apt._doc.farmerName = farmer.name;
            
        if (expert) apt._doc.expertName = expert.name;

        return apt;
      })
    );

    console.log(updatedAppointments);

    res.status(200).json(new APIResponse(updatedAppointments, null));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an appointment (farmers can only delete if it's not scheduled; experts can delete for themselves)
exports.delete = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    const { userRole, userId } = req.body; // userRole could be 'farmer' or 'expert'

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (userRole === "farmer") {
      // Farmers can only delete appointments that are not scheduled
      if (appointment.status === "Scheduled") {
        return res
          .status(403)
          .json({ message: "Cannot delete a scheduled appointment" });
      }
      // Delete the appointment for both farmer and expert
      await Appointment.deleteOne({ _id: appointmentId });
    } else if (userRole === "expert") {
      // Experts can only delete their own appointments
      if (appointment.expertId !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this appointment" });
      }
      // Delete the appointment for the expert only
      await Appointment.updateOne(
        { _id: appointmentId },
        { $set: { expertId: null, status: "Cancelled" } }
      );
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Schedule an appointment (only experts can set appointment time)
exports.schedule = async (req, res) => {
  try {
    const { appointmentId, appointmentTime, expertId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.expertId && appointment.expertId !== expertId) {
      return res
        .status(403)
        .json({ message: "Not authorized to schedule this appointment" });
    }

    if (appointment.status === "Scheduled") {
      return res
        .status(400)
        .json({ message: "Appointment is already scheduled" });
    }

    // Set appointment time and status
    appointment.appointmentTime = new Date(appointmentTime);
    appointment.status = "Scheduled";
    appointment.expertId = expertId;

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
