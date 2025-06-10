import Post from "../models/Post.js";
import Streak from "../models/Streak.js"; // import streak model here
import cloudinary from "../config/cloudinaryConfig.js";

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    let mediaUrl = "";

    if (req.file) {
      // ✅ Dynamically import streamifier (ESM-compatible)
      const streamifier = await import("streamifier");

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // ✅ Use .default because ESModule dynamic imports return the module object
        streamifier.default.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      mediaUrl = result.secure_url;
    }

    const post = new Post({
      user: req.user.id,
      content,
      mediaUrl,
    });

    await post.save();

    // Update streak after post saved (atomic streak update)
    await updateUserStreak(req.user.id);

    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const updateUserStreak = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ user: userId });
    console.log("Current streak data:", streak);

    if (!streak) {
      streak = new Streak({
        user: userId,
        currentStreak: 1,
        lastUpdated: today,
        longestStreak: 1,
      });
      await streak.save();
      console.log("New streak created:", streak);
      return streak;
    }

    const lastDate = new Date(streak.lastUpdated);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    console.log("Days since last update:", diffDays);

    if (diffDays === 1) {
      // consecutive day, increase streak
      streak.currentStreak += 1;
      streak.lastUpdated = today;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      console.log("Streak incremented:", streak.currentStreak);
    } else if (diffDays > 1) {
      // missed days, reset streak
      streak.currentStreak = 1;
      streak.lastUpdated = today;
      console.log("Streak reset to 1 due to missed days");
    } else if (diffDays === 0) {
      console.log("Streak already updated today - no changes");
    }

    await streak.save();
    return streak;
  } catch (err) {
    console.error("Error updating streak:", err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};
