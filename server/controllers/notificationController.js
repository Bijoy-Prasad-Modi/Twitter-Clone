import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "username profileImg",
      })
      .sort({ createdAt: -1 }) // Sort by newest notifications first
      .lean();

    await Notification.updateMany(
      { to: userId, read: false }, // Only update unread notifications
      { read: true }
    );

    res.status(200).json(notifications, length > 0 ? notifications : []);
  } catch (error) {
    console.error("Error in getNotifications function", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ to: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No notifications to delete" });
    }

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
