import Post from "../models/Post.js";
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
    return res.status(201).json(post);
  } catch (error) {
    next(error);
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
