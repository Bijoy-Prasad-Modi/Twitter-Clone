import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text.trim() && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;

    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Please log in first" });
    }

    const userId = req.user._id;

    // Validate comment text
    if (!text?.trim()) {
      return res.status(400).json({ error: "Comment can not be empty" });
    }

    // Fetch post & user in parallel for better performance
    const [post, user] = await Promise.all([
      Post.findById(postId),
      User.findById(userId),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add comment to post
    const comment = { user: userId, text: text.trim() };
    post.comments.push(comment);
    await post.save();

    // Notification on comment, Commenter is Not Post Owner
    if (userId.toString() !== post.user.toString()) {
      await new Notification({
        from: userId,
        to: post.user,
        type: "comment",
        post: postId, // Store postId for linking
        content: text.trim(), // Store actual comment text
      }).save();
    }

    // Populate user details in response
    const updatedPost = await Post.findById(postId)
      .populate({
        path: "user",
        select: "fullName username profileImg",
      })
      .populate({
        path: "comments.user",
        select: "fullName username profileImg",
      });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //Unlike post and remove notification
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true, select: "likes" }
      );

      // Remove postId from user's likedPosts array
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });

      // Remove the like notification from the database
      await Notification.deleteOne({
        from: userId,
        to: post.user,
        type: "like",
      });

      return res.status(200).json(updatedPost.likes);
    } else {
      // Check if user is liking their own post, do NOT create notification
      const notificationPromise =
        post.user.toString() !== userId.toString()
          ? new Notification({
              from: userId,
              to: post.user,
              type: "like",
            }).save()
          : Promise.resolve(); // Ensure Promise.all() does not fail by returning a resolved promise

      // Like post & update user's likedPosts array
      const [updatedPost] = await Promise.all([
        Post.findByIdAndUpdate(
          postId,
          { $push: { likes: userId } },
          { new: true, select: "likes" }
        ),
        User.updateOne({ _id: userId }, { $push: { likedPosts: postId } }), //update user id to the, post's liked array
        notificationPromise, //send notification on liking post
      ]);

      return res.status(200).json(updatedPost.likes);
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
