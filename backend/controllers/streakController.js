import Streak from "../models/Streak.js";

export const getUserStreak = async (req, res, next) => {
  try {
    const streak = await Streak.findOne({ user: req.user.id });
    if (!streak) {
      return res.status(404).json({ message: "No streak found for user" });
    }
    res.json(streak);
  } catch (error) {
    next(error);
  }
};

// Update streak logic: called after user creates a post for the day
export const updateUserStreak = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ user: req.user.id });

    if (!streak) {
      streak = new Streak({
        user: req.user.id,
        currentStreak: 1,
        lastUpdated: today,
        longestStreak: 1,
      });
      await streak.save();
      return res.json(streak);
    }

    const lastDate = new Date(streak.lastUpdated);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 1) {
      // consecutive day, increase streak
      streak.currentStreak += 1;
      streak.lastUpdated = today;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    } else if (diffDays > 1) {
      // missed days, reset streak
      streak.currentStreak = 1;
      streak.lastUpdated = today;
    } else if (diffDays === 0) {
      // already updated today, no change
    }

    await streak.save();
    res.json(streak);
  } catch (error) {
    next(error);
  }
};
