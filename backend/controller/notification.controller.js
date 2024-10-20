import Notification from "../model/notification.model.js"

/* CREATE */
export const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const newNotification = new Notification({ userId, message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};