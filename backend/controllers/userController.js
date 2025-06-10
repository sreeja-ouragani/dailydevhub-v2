import User from "../models/User.js";
import Post from "../models/Post.js";
import Streak from "../models/Streak.js";
import CollabRequest from "../models/CollabRequest.js";

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

// Get user profile by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [posts, streak, receivedRequests] = await Promise.all([
      Post.find({ author: id }),
      Streak.findOne({ user: id }),
      CollabRequest.find({ receiver: id, status: "pending" }),
    ]);

    res.json({
      user,
      posts,
      streak,
      receivedRequests,
    });
  } catch (error) {
    next(error);
  }
};
