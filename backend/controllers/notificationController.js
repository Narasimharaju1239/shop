const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.createNotification = async (req, res) => {
  const { message, user } = req.body;
  try {
    const note = await Notification.create({ message, user });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};
