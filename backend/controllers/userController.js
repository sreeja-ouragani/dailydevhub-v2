import User from "../models/User.js";

// Search users by query (username or email)
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    // Case-insensitive partial search on username or email
    const regex = new RegExp(q, "i");

    const users = await User.find({
      $or: [{ username: regex }, { email: regex }],
    }).select("username email"); // Return only username and email

    res.json(users);
  } catch (error) {
    next(error);
  }
};
